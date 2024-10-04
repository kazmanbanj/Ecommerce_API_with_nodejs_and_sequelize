import { it } from "mocha";
import { expect } from "chai";

it('can add number', function () {
    const num1 = 1;
    const num3 = 3;

    expect(num1 + num3).to.equal(4);
});