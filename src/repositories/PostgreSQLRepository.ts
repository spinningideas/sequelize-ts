"use strict";
import { Sequelize } from "sequelize-typescript";

const PostgreSQLRepository = (_sequelize?: Sequelize, _modelType?: any) => {
  const sequelize = _sequelize;
  const modelType = _modelType;
  let model = sequelize[_modelType];

  /**
   * return instance of model that this repository manages
   */
  const getModel = () => {
    if (!model) {
      if (sequelize.models && sequelize.models[modelType]) {
        model = sequelize.models[modelType];
      } else {
        throw new Error(`No model of type ${modelType} found`);
      }
    }
    return model;
  };

  /**
   * truncates table mapped to getModel()
   */
  const clear = (cb: Function) => {
    getModel()
      .truncate()
      .then(
        () => {
          if (cb) {
            cb(null, true);
          }
        },
        (err) => cb && cb(err)
      );
  };

  /**
   * close db connection
   * @returns {void}
   */
  const disconnect = () => {
    sequelize.close();
  };

  /**
   * get all records in given table mapped to model for this repository
   */
  const findAll = async (): Promise<any> => {
    const m = getModel();
    return m.findAll().then(
      (data) => {
        return data;
      },
      (err) => {
        return err;
      }
    );
  };

  /**
	 get all records having given criteria
	*/
  const findWhere = async (criteria: any) => {
    return getModel()
      .findAll(criteria)
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  };

  /**
	 get all records having given criteria in a paged and sorted fashion
	 using given pageNumber (1 based) and pageSize and order by data points
	*/
  const findWherePagedSorted = async (
    criteria: any,
    pageNumber: number,
    pageSize: number,
    orderBy: string,
    orderDesc: boolean | string
  ) => {
    if (pageNumber <= 0) {
      pageNumber = 1;
    }

    const offset = (pageNumber - 1) * pageSize;
    const limit = pageSize;
    let orderDirection = "ASC";
    if (orderDesc || orderDesc.toString().toLowerCase() === "true") {
      orderDirection = "DESC";
    }
    const order = [[orderBy, orderDirection]];

    const resultCount = await getModel()
      .count({ where: criteria })
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );

    const resultData = await getModel()
      .findAll({
        limit,
        offset,
        where: criteria,
        order,
      })
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );

    return { total: resultCount, data: resultData };
  };

  /**
   * get one record using given /:criteria
   */
  const findOneWhere = async (criteria: any) => {
    const modelOnWhere = getModel();
    return modelOnWhere
      .findOne({
        where: criteria,
      })
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  };

  /**
   * create a new record using given entity data
   */
  const create = async (entity: any) => {
    const m = getModel();
    return m.create(entity).then(
      (data) => {
        return data.toJSON();
      },
      (err) => {
        return err;
      }
    );
  };

  /**
   * upsert a record using given entity data and criteria
   */
  const upsert = async (criteria: any, entity: any) => {
    const existingData = await findOneWhere(criteria);
    if (existingData) {
      return updateWhere(criteria, entity);
    } else {
      return create(entity);
    }
  };

  /**
   * update records using given critera and entity data
   */
  const updateWhere = async (criteria: any, entity: any) => {
    const modelUpdateWhere = getModel();
    return modelUpdateWhere
      .update(entity, {
        where: { criteria },
        returning: true,
      })
      .then(
        (data) => {
          return data[1][0];
        },
        (err) => {
          return err;
        }
      );
  };

  /**
   * delete records using given criteria
   */
  const deleteWhere = async (criteria: any) => {
    const modelDeleteWhere = getModel();
    return modelDeleteWhere
      .destroy({
        where: criteria,
      })
      .then(
        (data) => {
          return data;
        },
        (err) => {
          return err;
        }
      );
  };

  return {
    clear,
    disconnect,
    findAll,
    findWhere,
    findWherePagedSorted,
    findOneWhere,
    create,
    upsert,
    updateWhere,
    deleteWhere,
  };
};

export default PostgreSQLRepository;
