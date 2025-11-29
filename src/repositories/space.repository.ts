import { Space } from '@models/Space.model';
import { ISpace, ISpaceInput, ISpaceFilters, IPaginationParams } from '../types/space.types';

export class SpaceRepository {
  /**
   * Find all spaces with filters and pagination (excluding soft-deleted)
   */
  async findAll(
    filters: ISpaceFilters,
    pagination: IPaginationParams
  ): Promise<{ spaces: ISpace[]; total: number }> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.city) {
      query.city = new RegExp(filters.city, 'i'); // Case-insensitive search
    }

    if (filters.search) {
      query.$or = [
        { spaceName: new RegExp(filters.search, 'i') },
        { city: new RegExp(filters.search, 'i') },
        { spaceType: new RegExp(filters.search, 'i') },
      ];
    }

    const [spaces, total] = await Promise.all([
      Space.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Space.countDocuments(query),
    ]);

    return { spaces, total };
  }

  /**
   * Find space by ID (excluding soft-deleted)
   */
  async findById(id: string): Promise<ISpace | null> {
    return await Space.findOne({ _id: id, isDeleted: false });
  }

  /**
   * Find space by spaceId (excluding soft-deleted)
   */
  async findBySpaceId(spaceId: string): Promise<ISpace | null> {
    return await Space.findOne({ spaceId, isDeleted: false });
  }

  /**
   * Create a new space
   */
  async create(spaceData: ISpaceInput): Promise<ISpace> {
    const space = new Space(spaceData);
    return await space.save();
  }

  /**
   * Update space by ID
   */
  async updateById(id: string, updateData: Partial<ISpaceInput>): Promise<ISpace | null> {
    return await Space.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Soft delete space by ID
   */
  async softDeleteById(id: string): Promise<ISpace | null> {
    return await Space.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  /**
   * Hard delete space by ID (for admin purposes)
   */
  async hardDeleteById(id: string): Promise<ISpace | null> {
    return await Space.findByIdAndDelete(id);
  }

  /**
   * Count documents with filters
   */
  async countDocuments(filters: ISpaceFilters): Promise<number> {
    const query: any = { isDeleted: false };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.city) {
      query.city = new RegExp(filters.city, 'i');
    }

    if (filters.search) {
      query.$or = [
        { spaceName: new RegExp(filters.search, 'i') },
        { city: new RegExp(filters.search, 'i') },
        { spaceType: new RegExp(filters.search, 'i') },
      ];
    }

    return await Space.countDocuments(query);
  }

  /**
   * Check if space exists by name and city
   */
  async existsByNameAndCity(spaceName: string, city: string, excludeId?: string): Promise<boolean> {
    const query: any = {
      spaceName: new RegExp(`^${spaceName}$`, 'i'),
      city: new RegExp(`^${city}$`, 'i'),
      isDeleted: false,
    };

    // Exclude current space when checking for duplicates during update
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const count = await Space.countDocuments(query);
    return count > 0;
  }
}

export const spaceRepository = new SpaceRepository();
