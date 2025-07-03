import { Test, TestingModule } from '@nestjs/testing';
import { ImageProcessorService } from './image.processor.service';
import { TASK_REPOSITORY } from '../../../domain/ports/task-repository.port';
import axios from 'axios';
import * as fs from 'fs';
import * as sharp from 'sharp';
import type { AxiosResponse } from 'axios/';

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    mkdir: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock sharp
jest.mock('sharp');
const mockedSharp = sharp as unknown as jest.Mock;

describe('ImageProcessorService', () => {
  let service: ImageProcessorService;

  const mockTaskRepository = {
    updateImagesAndStatus: jest.fn(),
    updateStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageProcessorService,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<ImageProcessorService>(ImageProcessorService);

    jest
      .spyOn(service as any, 'sleep')
      .mockImplementation(() => Promise.resolve());

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if task ID is missing', async () => {
    await expect(
      service.processTask({ originalPath: 'input/local-image.jpg' } as any),
    ).rejects.toThrow('Task ID is required to process the image');
  });

  it('should mark task as failed if originalPath is missing', async () => {
    await service.processTask({ id: '123' } as any);
    expect(mockTaskRepository.updateStatus).toHaveBeenCalledWith(
      '123',
      'failed',
    );
  });

  it('should process local image and call updateImagesAndStatus', async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValue(
      Buffer.from('fake-image'),
    );
    mockedSharp.mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('variant-image')),
    } as any);

    await service.processTask({
      id: 'abc123',
      originalPath: 'input/local-image.jpg',
    } as any);

    expect(fs.promises.readFile).toHaveBeenCalled();
    expect(mockTaskRepository.updateImagesAndStatus).toHaveBeenCalledWith(
      'abc123',
      expect.any(Array),
      'completed',
    );
  });

  it('should process image from URL and call updateImagesAndStatus', async () => {
    const mockAxiosResponse = {
      data: Buffer.from('fake-image'),
      status: 200,
      statusText: 'OK',
      headers: {} as Record<string, string>,
      config: {
        url: 'http://mocked.url',
        headers: {} as Record<string, string>,
      },
    } as unknown as AxiosResponse<Buffer>;

    mockedAxios.get.mockResolvedValue(mockAxiosResponse as any);

    mockedSharp.mockReturnValue({
      resize: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('variant-image')),
    } as any);

    await service.processTask({
      id: 'abc456',
      originalPath: 'http://example.com/image.jpg',
    } as any);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(mockTaskRepository.updateImagesAndStatus).toHaveBeenCalledWith(
      'abc456',
      expect.any(Array),
      'completed',
    );
  });

  it('should mark task as failed if loadImage throws', async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValue(new Error('fail'));

    await service.processTask({
      id: 'fail123',
      originalPath: 'input/broken.jpg',
    } as any);

    expect(mockTaskRepository.updateStatus).toHaveBeenCalledWith(
      'fail123',
      'failed',
    );
  });
});
