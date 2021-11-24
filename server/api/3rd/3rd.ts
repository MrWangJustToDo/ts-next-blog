import { Method } from "axios";
import { createRequest } from "utils/fetcher";
import { fail, success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

const get3rdRequestAction = wrapperMiddlewareRequest({
  requestHandler: async function thirdRequest({ req, res }) {
    const { path, ...lastQuery } = req.query;
    const { data } = req.body;
    const { origin, referer, cookie, ...lastHeader } = req.headers;
    const request = createRequest({
      path: path as string,
      method: req.method as Method,
      data,
      query: lastQuery as { [p: string]: string },
      header: lastHeader,
    });
    await request
      .run()
      .then((data) => success({ res, resDate: { data } }))
      .catch((e) => fail({ res, resDate: { data: e.toString() } }));
  },
  cacheConfig: { needCache: true, cacheKey: ({ req }) => req.method + ":" + req.query.path },
  paramsConfig: { fromQuery: ["path"] },
});

export { get3rdRequestAction };
