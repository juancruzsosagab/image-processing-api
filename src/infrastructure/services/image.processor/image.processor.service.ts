import { Injectable, Logger, Inject } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import axios from 'axios';
import { TaskRepositoryPort } from '../../../domain/ports/task-repository.port';
import { TASK_REPOSITORY } from '../../../domain/ports/task-repository.port';
import { TaskProps, TaskImage } from '../../../domain/models/task.props';

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);

  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  /**
   * Processes a task:
   * - Loads the original image (local path or URL)
   * - Generates 1024px and 800px width variants
   * - Saves variants to disk with MD5-based filenames
   * - Updates task in MongoDB with paths and status
   */
  async processTask(task: TaskProps): Promise<void> {
    this.logger.log(`Processing task ${task.id}`);

    if (!task.id) {
      this.logger.error(`Cannot process task: missing ID`);
      throw new Error('Task ID is required to process the image');
    }

    this.logger.log(`Processing task ${task.id}`);

    if (!task.originalPath) {
      this.logger.error(`Task ${task.id} has no originalPath`);
      await this.taskRepository.updateStatus(task.id, 'failed');
      return;
    }
    // Simulate processing delay for testing "pending" state
    await this.sleep(4000);

    try {
      // Load the original image (local or URL)
      const inputBuffer = await this.loadImage(task.originalPath);
      this.logger.log(`Loaded image for task ${task.id}`);

      // Generate variants
      const resolutions = [1024, 800];
      const images: TaskImage[] = [];

      for (const res of resolutions) {
        const variantBuffer = await sharp(inputBuffer).resize(res).toBuffer();

        const md5 = crypto
          .createHash('md5')
          .update(variantBuffer)
          .digest('hex');
        const ext = '.jpg';
        const originalName = path.basename(task.originalPath).split('.')[0];
        const outputPath = path.join(
          'output',
          originalName,
          res.toString(),
          `${md5}${ext}`,
        );

        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.promises.writeFile(outputPath, variantBuffer);

        images.push({
          resolution: res.toString(),
          path: `/${outputPath}`,
        });

        this.logger.log(`Generated ${res}px variant at /${outputPath}`);
      }

      // Update task as completed
      await this.taskRepository.updateImagesAndStatus(
        task.id,
        images,
        'completed',
      );
      this.logger.log(`Task ${task.id} marked as completed`);
    } catch (error) {
      this.logger.error(`Error processing task ${task.id}:`, error);
      await this.taskRepository.updateStatus(task.id, 'failed');
    }
  }

  /**
   * Loads an image from a URL or local path and returns it as a Buffer.
   */
  private async loadImage(originalPath: string): Promise<Buffer> {
    if (
      originalPath.startsWith('http://') ||
      originalPath.startsWith('https://')
    ) {
      // Download image from remote URL
      this.logger.log(`Downloading image from URL: ${originalPath}`);

      const response = await axios.get<Buffer>(originalPath, {
        responseType: 'arraybuffer',
      });

      if (!response.data) {
        this.logger.error(`Empty response from URL: ${originalPath}`);
        throw new Error('Failed to download image: empty response data');
      }

      this.logger.log(`Successfully downloaded image from URL`);
      return response.data;
    } else {
      // Read image from local file system
      this.logger.log(`Reading local image from path: ${originalPath}`);
      return fs.promises.readFile(originalPath);
    }
  }

  /**
   * Helper to simulate processing delay
   * NOTE: Added for testing "pending" state in demo
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
