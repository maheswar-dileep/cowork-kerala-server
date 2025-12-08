import { spaceRepository } from "@repositories/space.repository";
import {
    ISpace,
    ISpaceInput,
    ISpaceResponse,
    ISpaceFilters,
    IPaginationParams,
    IPaginatedSpacesResponse,
} from "../types/space.types";
import { ApiError } from "../types/common.types";

export class SpaceService {
    /**
     * Get all spaces with pagination and filters
     */
    async getAllSpaces(
        filters: ISpaceFilters,
        pagination: IPaginationParams
    ): Promise<IPaginatedSpacesResponse> {
        const { spaces, total } = await spaceRepository.findAll(
            filters,
            pagination
        );

        const totalPages = Math.ceil(total / pagination.limit);

        return {
            success: true,
            data: spaces.map((space) => this.formatSpaceResponse(space)),
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages,
            },
        };
    }

    /**
     * Get featured spaces
     */
    async getFeaturedSpaces(): Promise<ISpaceResponse[]> {
        const spaces = await spaceRepository.findFeatured();
        return spaces.map((space) => this.formatSpaceResponse(space));
    }

    /**
     * Get space by ID
     */
    async getSpaceById(id: string): Promise<ISpaceResponse> {
        const space = await spaceRepository.findById(id);

        if (!space) {
            throw new ApiError(404, "Space not found");
        }

        return this.formatSpaceResponse(space);
    }

    /**
     * Create new space
     */
    async createSpace(spaceData: ISpaceInput): Promise<ISpaceResponse> {
        // Check if space with same name and city already exists
        const exists = await spaceRepository.existsByNameAndCity(
            spaceData.spaceName,
            spaceData.city
        );

        if (exists) {
            throw new ApiError(
                409,
                `A space with name "${spaceData.spaceName}" already exists in ${spaceData.city}`
            );
        }

        const space = await spaceRepository.create(spaceData);

        return this.formatSpaceResponse(space);
    }

    /**
     * Update space
     */
    async updateSpace(
        id: string,
        updateData: Partial<ISpaceInput>
    ): Promise<ISpaceResponse> {
        // Check if space exists
        const existingSpace = await spaceRepository.findById(id);

        if (!existingSpace) {
            throw new ApiError(404, "Space not found");
        }

        // If updating name or city, check for duplicates
        if (updateData.spaceName || updateData.city) {
            const nameToCheck = updateData.spaceName || existingSpace.spaceName;
            const cityToCheck = updateData.city || existingSpace.city;

            // Pass the current space ID to exclude it from duplicate check
            const exists = await spaceRepository.existsByNameAndCity(
                nameToCheck,
                cityToCheck,
                id
            );

            if (exists) {
                throw new ApiError(
                    409,
                    `A space with name "${nameToCheck}" already exists in ${cityToCheck}`
                );
            }
        }

        const updatedSpace = await spaceRepository.updateById(id, updateData);

        if (!updatedSpace) {
            throw new ApiError(404, "Space not found");
        }

        return this.formatSpaceResponse(updatedSpace);
    }

    /**
     * Delete space (soft delete)
     */
    async deleteSpace(id: string): Promise<void> {
        const space = await spaceRepository.softDeleteById(id);

        if (!space) {
            throw new ApiError(404, "Space not found");
        }
    }

    /**
     * Format space response (remove sensitive data)
     */
    formatSpaceResponse(space: ISpace): ISpaceResponse {
        return {
            id: space._id.toString(),
            spaceId: space.spaceId,
            spaceName: space.spaceName,
            spaceType: space.spaceType,
            city: space.city,
            spaceCategory: space.spaceCategory,
            shortDescription: space.shortDescription,
            longDescription: space.longDescription,
            amenities: space.amenities,
            pricing: space.pricing,
            location: space.location,
            contact: space.contact,
            images: space.images,
            status: space.status,
            isFeatured: space.isFeatured,
            createdAt: space.createdAt,
            updatedAt: space.updatedAt,
        };
    }
}

export const spaceService = new SpaceService();
