import { TaskProps, TaskStatus, TaskImage } from './task.props';

export class Task {
  constructor(
    public id: string | undefined,
    public status: TaskStatus,
    public price: number,
    public originalPath?: string,
    public images: TaskImage[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  static create(props: Partial<TaskProps> & { id?: string }): Task {
    return new Task(
      props.id,
      props.status!,
      props.price!,
      props.originalPath,
      props.images ?? [],
      props.createdAt,
      props.updatedAt,
    );
  }
}
