import { getPrisma } from "@repo/database";
import { ProjectPriority, TaskInput, TaskStatus } from "@repo/shared";

export class TaskRepository {
    readonly #prisma = getPrisma();

    async create(taskData: TaskInput) {
        return this.#prisma.task.create({
            data: {
                title: taskData.title,
                description: taskData.description,
                endDate: taskData.endDate ? new Date(taskData.endDate) : null,
                priority: taskData.priority ?? ProjectPriority.COULD,
                statut: taskData.statut ?? TaskStatus.NOT_STARTED,
                projectId: taskData.projectId,
                assignedUserId: taskData.assignedUserId,
            },
        });
    }
}
