import { pool, poolConnect, sql } from './database';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function bindInput(request: sql.Request, key: string, value: any) {
  if (typeof value === 'string' && guidRegex.test(value.trim())) {
    request.input(key, sql.UniqueIdentifier, value.trim());
  } else {
    request.input(key, value);
  }
}

export { pool, poolConnect };

export async function query<T = any>(sqlText: string, params: Record<string, any> = {}) {
  await poolConnect;
  const request = pool.request();

  for (const [key, value] of Object.entries(params)) {
    bindInput(request, key, value);
  }

  const result = await request.query(sqlText);
  return result.recordset as T[];
}

export async function execute(sqlText: string, params: Record<string, any> = {}) {
  await poolConnect;
  const request = pool.request();

  for (const [key, value] of Object.entries(params)) {
    bindInput(request, key, value);
  }

  return request.query(sqlText);
}
