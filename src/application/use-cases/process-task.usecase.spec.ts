/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTaskUseCase } from './process-task.usecase';
import {
  TASK_REPOSITORY,
  TaskRepositoryPort,
} from '../../domain/ports/task-repository.port';
import { ImageProcessorService } from '../../infrastructure/services/image.processor/image.processor.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TaskProps } from '../../domain/models/task.props';

describe('ProcessTaskUseCase', () => {
  let useCase: ProcessTaskUseCase;
  let mockTaskRepository: TaskRepositoryPort;
  let mockImageProcessorService: ImageProcessorService;

  beforeEach(async () => {
    mockTaskRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      updateImagesAndStatus: jest.fn(),
      updateStatus: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockImageProcessorService = {
      processTask: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
        {
          provide: ImageProcessorService,
          useValue: mockImageProcessorService,
        },
      ],
    }).compile();

    useCase = module.get<ProcessTaskUseCase>(ProcessTaskUseCase);
  });

  it('should throw NotFoundException if task does not exist', async () => {
    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('nonexistent');
  });

  it('should throw BadRequestException if task status is not pending', async () => {
    const task: TaskProps = {
      id: 'task123',
      originalPath: 'some/path.jpg',
      status: 'completed',
      price: 10,
      images: [],
    };
    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(task);

    await expect(useCase.execute('task123')).rejects.toThrow(
      BadRequestException,
    );
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('task123');
  });

  it('should call imageProcessorService.processTask if task is pending', async () => {
    const task: TaskProps = {
      id: 'task123',
      originalPath: 'some/path.jpg',
      status: 'pending',
      price: 10,
      images: [],
    };
    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(task);

    await useCase.execute('task123');

    expect(mockTaskRepository.findById).toHaveBeenCalledWith('task123');
    expect(mockImageProcessorService.processTask).toHaveBeenCalledWith(task);
  });
});
