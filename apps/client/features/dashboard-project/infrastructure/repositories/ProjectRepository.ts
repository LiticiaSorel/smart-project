import { api } from "@/lib/api";
import { Project } from "../../domain/entities/Project";
import { QueryBuilder } from "../../domain/query/QueryBuilder";
import { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import { ProjectInput } from "@repo/shared";

function toProject(project: Project): Project {
    return new Project(
        project.id,
        project.titre,
        project.description,
        project.leadId ?? null,
        project.createdAt,
        project.lead,
        project.teams ?? [],
        project.tasks ?? []
    );
}

export class ProjectRepository
    implements IProjectRepository
{
    async getProjects(query?: QueryBuilder): Promise<Project[]> {
        const qs = query?.build();
        const endpoint = qs ? `/projects?${qs}` : "/projects";

        const response = await api.get(endpoint);
        return response.data.data.map((item: Project) => toProject(item));
    }

    async getSingleProject(projectId: string): Promise<Project> {
        const result = await api.get(`/project/${projectId}`);
        const project = result.data?.data ?? result.data?.project ?? result.data;

        return toProject(project);
    }

    async create(payload: ProjectInput): Promise<Omit<Project, "lead">> {
        const result = await api.post<{ data: Project }>("/project/register", {
            ...payload,
            description: payload.description ?? "",
        });
        const project = result.data?.data ?? result.data;

        return toProject(project as Project);
    }

    async update(id: string, payload: ProjectInput): Promise<Project> {
        const result = await api.put<{ data: Project }>(`/project/${id}`, {
            ...payload,
            description: payload.description ?? "",
        });
        const project = result.data?.data ?? result.data;

        return toProject(project as Project);
    }

    async delete(id: string): Promise<void> {
        await api.delete(`/project/${id}`);
    }

    async inviteMember(projectId: string, userId: string): Promise<void> {
        await api.post("/project/add-new-member", {
            projectId,
            newMemberId: userId,
        });
    }
}
