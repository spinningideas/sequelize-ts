import sequelize from "sequelize";
import { IBaseRepository } from "repositories/IBaseRepository";
import { Criteria } from "repositories/Criteria";
import RepositoryResult from "repositories/RepositoryResult";
import RepositoryResultPaged from "repositories/RepositoryResultPaged";

const DEFAULT_PAGE_SIZE = 10;

const pagination = {
  getPagination: (page: number, size: number) => {
    const limit = size ? +size : DEFAULT_PAGE_SIZE;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  },
  getPagedData<M>(
    success: boolean,
    data: any,
    page: number,
    limit: number
  ): RepositoryResultPaged<M, any> {
    const { count: totalItems, rows } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      success,
      data: rows,
      totalItems,
      errors: undefined,
      totalPages,
      currentPage,
    } as unknown as RepositoryResultPaged<M, any>;
  },
};

const initNamedQueries = (that: any, model: any) => {
  Object.getOwnPropertyNames(that.className.prototype).forEach((n) => {
    if (n.startsWith("findBy") || n.startsWith("findAllBy")) {
      const buildQuery = (slice: any, ...args: any) => {
        const splitted = slice ? n.slice(0, slice).split("By") : n.split("By");
        const properties = splitted
          .join("")
          .split(splitted[0])
          .join("")
          .split("And");
        const query: any = { where: {}, include: { all: true } };
        for (let i = 0; i < args.length; i++) {
          if (Array.isArray(args[i])) {
            query.where[properties[i]] = { in: args[i] };
            continue;
          }
          query.where[properties[i]] = args[i];
        }
        return query;
      };
      if (n.slice(-9) === "Paginated") {
        that[n] = async function (page = 0, size = 10, ...args: any) {
          const query = buildQuery(-9, ...args);
          const { limit, offset } = pagination.getPagination(page, size);
          const response = await model.findAndCountAll({
            where: query.where,
            limit,
            offset,
            include: { all: true },
          });
          return pagination.getPagedData(true, response, page, limit);
        };
      } else {
        that[n] = async function (slice: any, ...args: any) {
          return model.findAll(buildQuery(slice, args));
        };
      }
    }
  });
};

/**
 * @summary Abstract repository for Sequelize entities with all basic persistence methods.
 * In order to use this class you must extend from it and instantiate it with the corresponding
 *  model and the name of the primary key
 * @example
 * class SomeModelRepository extends BaseRepository {
 *   constructor() {
 *     super(SomeModelRepository, db.SomeModel, 'some_model_id' })
 *   }
 * }
 */
abstract class BaseRepository<M extends sequelize.Model>
  implements IBaseRepository<M>
{
  private className: string;
  private model: any;

  constructor(className: any, model: any) {
    if (this.constructor === BaseRepository)
      throw new Error("Can not instantiate an abstract class");
    this.className = className;
    this.model = model;
    initNamedQueries(this.className, model);
  }

  /**
   * Given a query object returns a single {model} instance including all its associations
   * @param criteria: {fields}
   * @returns {Promise<*|RepositoryResult}
   */
  async findOneWhere(criteria: Criteria): RepositoryResult<M> {
    return this.model.findOne({ where: { criteria }, include: { all: true } });
  }

  /**
   * Given a query object Returns a list of {model} instances including all its associations
   * @param query: {fields}
   * @returns {Promise<*|Model[]>}
   */
  async findWhere(criteria: Criteria): RepositoryResult<M[]> {
    return this.model.findAll({ where: criteria, include: { all: true } });
  }

  /**
   * Given a criteria returns paged set of models that match the criteria using
   * the page number, page size, and ordering criteria provided.
   * Returns the subset of data and the total records and the resulting pagination meta data.
   * If no order attribute is given it will use the database default
   * @param criteria
   * @param pageNumber
   * @param pageSize
   * @param orderBy
   * @param orderDesc
   * @returns {Promise<{totalItems: *, totalPages: number, rows: *, currentPage: number}>}
   */
  async findWherePaginated(
    criteria: Criteria,
    pageNumber: number,
    pageSize: number,
    orderBy: string,
    orderDesc: boolean
  ): Promise<RepositoryResultPaged<M, unknown>> {
    const { limit, offset } = pagination.getPagination(pageNumber, pageSize);
    const condition = criteria.getCriteria();
    let order;
    let response;
    if (orderDesc) {
      order = [[orderBy, "DESC"]];
      response = await this.model.findAndCountAll({
        where: condition,
        limit,
        offset,
        order,
        include: { all: true },
      });
      return pagination.getPagedData(true, response, pageNumber, limit);
    }
    response = await this.model.findAndCountAll({
      where: condition,
      limit,
      offset,
      include: { all: true },
    });
    return pagination.getPagedData(true, response, pageNumber, limit);
  }

  /**
   * Returns a list of {model} instances including all its associations
   * @returns {RepositoryResult<M[]>>}
   */
  async findAll() {
    return this.model.findAll({ include: { all: true } });
  }

  /**
   * Given a field and an optional criteria, returns the count of all occurrences of model
   * @param field
   * @param criteria
   * @returns {Promise<number>}
   */
  async countWhere(criteria?: Criteria) {
    if (criteria) {
      return this.model.count(criteria.getCriteria());
    }
    return this.model.count();
  }

  /**
   * Persists given model to database.
   * Returns the created instance of the model.
   * @param model
   * @returns {RepositoryResult<M>}
   */
  async create(model: M): RepositoryResult<M> {
    let val = model;
    if (model.dataValues) {
      val = { ...model.dataValues };
    }
    const res = await this.model.upsert({ ...val, updated_date: new Date() });
    return res[1] ? res[0] : null;
  }

  async createMany(models: M[]): RepositoryResult<M[]> {
    let results: RepositoryResult<M>[];
    for (let i = 0; i < models.length; i++) {
      let m = models[i];
      let result = await this.create(m);
      let resultType = result.getData() as unknown as RepositoryResult<M>;
      results.push(resultType);
    }
    return results as any;
  }

  async updateWhere(criteria: Criteria, model: M): RepositoryResult<M> {
    let val = model;
    if (model.dataValues) {
      val = { ...model.dataValues };
    }
    const res = await this.model.upsert({ ...val }, criteria);
    return res[1] ? res[0] : null;
  }

  async upsertWhere(criteria: Criteria, model: M): RepositoryResult<M> {
    let val = model;
    if (model.dataValues) {
      val = { ...model.dataValues };
    }
    const res = await this.model.upsert({ ...val }, criteria);
    return res[1] ? res[0] : null;
  }

  /**
   * Given a criteria object does hard delete the first occurrence of {model}
   * @param query
   * @returns {Promise<*|Model|null>}
   */
  async deleteWhere(criteria: Criteria) {
    const d = this.model.findOne({ criteria, include: { all: true } });
    return this.model.remove(d);
  }

  /**
   * Given a criteria object does logical or soft delete the first occurrence of {model}
   * @param query
   * @returns {Promise<*|Model|null>}
   */
  async deleteLogicalWhere(criteria: Criteria) {
    const d = this.model.findOne({ where: criteria, include: { all: true } });
    return this.model.softRemove(d);
  }
}

export default BaseRepository;
