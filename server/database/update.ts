import { ServerError } from "server/utils/error";
import { Database } from "sqlite";
import { log } from "utils/log";

/**
 * update操作
 * @param {db: Object, table: String, param: {set: {String: String}, where: {String: {value:operator}}}} params db 数据库连接对象，table 表名称，paramupdate参数{set:{typeCount: 1}, where: {typeId: {value: 1, oparetor: 'and'}}}
 */
export const updateTableWithParam = async ({
  db,
  table,
  param,
}: {
  db: Database;
  table: "users" | "author" | "type" | "tag" | "blogs" | "home" | "usersEx" | "primaryComment" | "childComment";
  param: { set: { [props: string]: string | number }; where: { [props: string]: { value: string | number; operator?: string } } };
}) => {
  let Sql = `UPDATE ${table} SET`;
  const sqlParam = [];
  const set = param.set;
  if (!set || typeof set !== "object") {
    throw new ServerError(`更新${table}参数错误`, 400);
  }
  for (let key in set) {
    if (set[key] !== undefined) {
      Sql += ` ${key} = ?,`;
      sqlParam.push(set[key]);
    }
  }
  Sql = Sql.slice(0, -1);
  const where = param.where;
  if (!where || typeof where !== "object") {
    throw new ServerError(`更新${table}参数错误`, 400);
  }
  Sql = Sql + " WHERE";
  for (let key in where) {
    Sql += ` ${key} = ?`;
    sqlParam.push(where[key].value);
    if (where[key].operator) {
      Sql += ` ${where[key].operator}`;
    }
  }
  log(`update sql: ${Sql} --> params: ${sqlParam.join(", ")}`, "normal");
  return await db.run(Sql, ...sqlParam);
};

// 更新指定type的count计数
export const updateTypeCountByTypeId = async ({ db, typeId, count }: { db: Database; typeId: string; count: number }) => {
  return await db.run("UPDATE type SET typeCount = ? WHERE typeId = ? ", count, typeId);
};

// 更新指定tag的count计数
export const updateTagCountByTagId = async ({ db, count, tagId }: { db: Database; count: number; tagId: string }) => {
  return await db.run("UPDATE tag SET tagCount = ? WHERE tagId = ?", count, tagId);
};
