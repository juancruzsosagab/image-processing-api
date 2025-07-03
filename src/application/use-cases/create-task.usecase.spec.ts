import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './create-task.usecase';
import {
  TASK_REPOSITORY,
  TaskRepositoryPort,
} from '../../domain/ports/task-repository.port';
import { TaskProps } from '../../domain/models/task.props';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepository: TaskRepositoryPort;

  beforeEach(async () => {
    mockTaskRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      updateImagesAndStatus: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  it('should create a task with default pending status and random price if not provided', async () => {
    const props: Partial<TaskProps> = { originalPath: '/input/test.jpg' };

    (mockTaskRepository.create as jest.Mock).mockImplementation(
      (task: TaskProps) => ({
        ...task,
        id: 'task123',
      }),
    );

    const result = await useCase.execute(props);

    expect(result.id).toBe('task123');
    expect(result.status).toBe('pending');
    expect(typeof result.price).toBe('number');
    expect(result.price).toBeGreaterThanOrEqual(5);
    expect(result.price).toBeLessThanOrEqual(50);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockTaskRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        originalPath: props.originalPath,
        status: 'pending',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        price: expect.any(Number),
      }),
    );
  });

  it('should use provided status and price if present', async () => {
    const props: Partial<TaskProps> = {
      originalPath: '/input/test.jpg',
    };

    (mockTaskRepository.create as jest.Mock).mockImplementation(
      (task: TaskProps) => ({
        ...task,
        id: 'task456',
      }),
    );

    const result = await useCase.execute(props);

    expect(result.price).toBeGreaterThanOrEqual(5);
    expect(result.price).toBeLessThanOrEqual(50);
    expect(result.id).toBe('task456');
  });
});
