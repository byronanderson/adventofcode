import { runTests, test } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test(async function mytest() {
  assertEquals(["bar"], ["bar"]);
  await delay(0);
  assertEquals([], ["foo"]);
});

runTests();
