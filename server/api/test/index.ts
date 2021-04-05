import { apiName } from "config/api";
import {
  test_author,
  test_childComment,
  test_insertTag,
  test_insertType,
  test_insertUserEx,
  test_primaryComment,
  test_publishBlog,
  test_publishHome,
  test_registerUser,
} from "./test";

const testHandler = {
  [apiName.testBlog]: test_publishBlog,
  [apiName.testChild]: test_childComment,
  [apiName.testHome]: test_publishHome,
  [apiName.testPrimary]: test_primaryComment,
  [apiName.testTag]: test_insertTag,
  [apiName.testType]: test_insertType,
  [apiName.testUser]: test_registerUser,
  [apiName.testUserEx]: test_insertUserEx,
  [apiName.testAuthor]: test_author,
};

export { testHandler };
