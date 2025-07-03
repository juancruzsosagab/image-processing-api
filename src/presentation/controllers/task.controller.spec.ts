/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.usecase';
import { GetTaskUseCase } from '../../application/use-cases/get-task.usecase';
import { ProcessTaskUseCase } from '../../application/use-cases/process-task.usecase';
import { NotFoundException } from '@nestjs/common';
import { TaskProps } from '../../domain/models/task.props';

describe('TaskController', () => {
  let controller: TaskController;
  let createTaskUseCase: CreateTaskUseCase;
  let getTaskUseCase: GetTaskUseCase;
  let processTaskUseCase: ProcessTaskUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetTaskUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProcessTaskUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    createTaskUseCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
    getTaskUseCase = module.get<GetTaskUseCase>(GetTaskUseCase);
    processTaskUseCase = module.get<ProcessTaskUseCase>(ProcessTaskUseCase);
  });

  describe('createTask', () => {
    it('should create a task and trigger processing', async () => {
      const mockTask: TaskProps = {
        id: 'task123',
        originalPath: 'input/image.jpg',
        status: 'pending',
        price: 25,
      };

      (createTaskUseCase.execute as jest.Mock).mockResolvedValue(mockTask);
      (processTaskUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const body = { originalPath: 'input/image.jpg' };
      const result = await controller.createTask(body);

      expect(createTaskUseCase.execute).toHaveBeenCalledWith(body);
      expect(processTaskUseCase.execute).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual({
        id: mockTask.id,
        status: mockTask.status,
        price: mockTask.price,
      });
    });

    it('should return task even if it has no id and log error', async () => {
      const mockTask = {
        originalPath: 'input/image.jpg',
        status: 'pending',
        price: 25,
      };

      (createTaskUseCase.execute as jest.Mock).mockResolvedValue(mockTask);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const loggerErrorSpy = jest.spyOn((controller as any).logger, 'error');

      const result = await controller.createTask({
        originalPath: 'input/image.jpg',
      });

      expect(createTaskUseCase.execute).toHaveBeenCalled();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Created task is missing ID. Cannot process.',
      );
      expect(result).toEqual(mockTask);
      expect(processTaskUseCase.execute).not.toHaveBeenCalled();
    });

    it('should catch and log error if processing fails', async () => {
      const mockTask: TaskProps = {
        id: 'task123',
        originalPath: 'input/image.jpg',
        status: 'pending',
        price: 25,
      };

      (createTaskUseCase.execute as jest.Mock).mockResolvedValue(mockTask);

      const error = new Error('Processing failed');
      (processTaskUseCase.execute as jest.Mock).mockRejectedValue(error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const loggerErrorSpy = jest.spyOn((controller as any).logger, 'error');

      await controller.createTask({ originalPath: 'input/image.jpg' });

      await new Promise(process.nextTick);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        `Failed to process task ${mockTask.id}: ${error.message}`,
      );
    });
  });

  describe('getById', () => {
    it('should return the task if found', async () => {
      const mockTask: TaskProps = {
        id: 'task123',
        originalPath: 'input/image.jpg',
        status: 'pending',
        price: 25,
      };

      (getTaskUseCase.execute as jest.Mock).mockResolvedValue(mockTask);

      const result = await controller.getById({ id: 'task123' });

      expect(getTaskUseCase.execute).toHaveBeenCalledWith('task123');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      (getTaskUseCase.execute as jest.Mock).mockResolvedValue(null);

      await expect(controller.getById({ id: 'nonexistent' })).rejects.toThrow(
        NotFoundException,
      );
      expect(getTaskUseCase.execute).toHaveBeenCalledWith('nonexistent');
    });
  });
});
