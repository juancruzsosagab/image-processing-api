import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskUseCase } from './get-task.usecase';
import {
  TASK_REPOSITORY,
  TaskRepositoryPort,
} from '../../domain/ports/task-repository.port';
import { TaskProps } from '../../domain/models/task.props';

describe('GetTaskUseCase', () => {
  let useCase: GetTaskUseCase;
  let mockTaskRepository: TaskRepositoryPort;

  beforeEach(async () => {
    mockTaskRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      updateImagesAndStatus: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetTaskUseCase>(GetTaskUseCase);
  });

  it('should return task if found', async () => {
    const mockTask: TaskProps = {
      id: 'task123',
      originalPath: '/input/test.jpg',
      status: 'pending',
      price: 10,
      images: [],
    };

    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(mockTask);

    const result = await useCase.execute('task123');

    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('task123');
  });

  it('should return null if task not found', async () => {
    (mockTaskRepository.findById as jest.Mock).mockResolvedValue(null);

    const result = await useCase.execute('nonexistent');

    expect(result).toBeNull();
    expect(mockTaskRepository.findById).toHaveBeenCalledWith('nonexistent');
  });
});
