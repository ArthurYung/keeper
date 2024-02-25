import Benchmark from "benny";
import { createKeeper } from "../dist/index.js";
import { extendsTestData, testData10, testData100 } from "./data.js";
import { cloneDeep, get } from "lodash-es";

// const suite = new Benchmark.Suite();

const test100Object = createKeeper(testData100);
const extendsObject = createKeeper(extendsTestData, {
  extends: {
    testData: test100Object,
  },
});

const extendsObject2 = createKeeper(extendsTestData, {
  extends: {
    testData: extendsObject,
  },
});

const testExtendsObject = extendsObject.from({});
const testDeepExtendsObject = extendsObject2.from({});

// 添加测试
Benchmark.suite(
  "Keeper Benchmark(Github action runner)",
  Benchmark.add("parse 10 properties string", function () {
    createKeeper(testData10);
  }),
  Benchmark.add("parse 100 properties string", function () {
    createKeeper(testData100);
  }),
  Benchmark.add("parse extends properties string", function () {
    createKeeper(extendsTestData, {
      extends: {
        testData: test100Object,
      },
    });
  }),
  Benchmark.add("create 100 properties object", function () {
    test100Object.from({});
  }),
  Benchmark.add("create 100 properties object from target srouce", () => {
    test100Object.from(test100Object);
  }),
  Benchmark.add("create object with extends properties(100 * 8)", () => {
    extendsObject.from({});
  }),
  Benchmark.add("lodash clone deep (100 * 8)", () => {
    cloneDeep(testExtendsObject);
  }),
  Benchmark.add(
    "create object with deep extends properties(100 * 8 * 8)",
    () => {
      extendsObject2.from({});
    },
  ),
  Benchmark.add("lodash clone deep (100 * 8 * 8)", () => {
    cloneDeep(testDeepExtendsObject);
  }),
  // add listeners
  Benchmark.cycle(), //.on("cycle", function (event) {
  Benchmark.complete(),
  Benchmark.save({ file: "keeper", format: "chart.html" }),
);

Benchmark.suite(
  "Benchmark Lazy parsing & Keeper.raed()",

  Benchmark.add("lazy parse extends properties string", function () {
    createKeeper(extendsTestData, {
      extends: {
        testData: test100Object,
      },
      lazy: true,
    });
  }),

  Benchmark.add("read properties", () => {
    extendsObject2.read({}, "extend1.extend1.name");
  }),

  Benchmark.cycle(), //.on("cycle", function (event) {
  Benchmark.complete(),
  Benchmark.save({ file: "keeper-lazy", format: "chart.html" }),
);
