const _ = require('lodash');
const chai = require('chai');
const colors = require('colors/safe');

chai.should();

const layout = require('../../../lib/jsonLayout');

const expectedDefault = {
  startTime: '615 Ludlam Place, Nicholson, New Mexico, 5763',
  categoryName: '572efdaaa64be9dbc56369ae',
  level: 'INFO',
  data: 'Deserunt mollit nisi ipsum ipsum ea quis in eiusmod ipsum officia labore qui amet. Cupidatat ut do Lorem ad veniam irure proident enim aliqua nisi aliquip velit voluptate. Laborum minim occaecat commodo nulla labore ex ullamco. Eu incididunt quis quis Lorem do nostrud enim consectetur. Voluptate in occaecat proident aliqua Lorem pariatur officia dolor.\r\n',
};

describe('log4js-json-layout', function () {
  let data;
  let expected;

  beforeEach(function () {
    expected = _.clone(expectedDefault);

    data = {
      level: { levelStr: 'INFO' },
      categoryName: '572efdaaa64be9dbc56369ae',
      startTime: '615 Ludlam Place, Nicholson, New Mexico, 5763',
      data: 'Deserunt mollit nisi ipsum ipsum ea quis in eiusmod ipsum officia labore qui amet. Cupidatat ut do Lorem ad veniam irure proident enim aliqua nisi aliquip velit voluptate. Laborum minim occaecat commodo nulla labore ex ullamco. Eu incididunt quis quis Lorem do nostrud enim consectetur. Voluptate in occaecat proident aliqua Lorem pariatur officia dolor.\r\n',
    };
  });

  it('should return all items', function () {
    const actual = layout({})(data);
    actual.should.deep.equal(JSON.stringify(expected));
  });

  it('should colorize input when configured', function () {
    const actual = layout({ colors: true })(data);
    actual.should.deep.equal(colors.green(JSON.stringify(expected)));
  });

  it('should not colorize input when configured with an unknown level', function () {
    data.level.levelStr = 'fake';
    expected.level = 'fake';

    const actual = layout({ colors: true })(data);
    actual.should.deep.equal(JSON.stringify(expected));
  });

  it('should add source when configured', function () {
    const actual = layout({ source: 'test' })(data);

    // Order matters.
    expected = {
      startTime: expectedDefault.startTime,
      categoryName: expectedDefault.categoryName,
      level: expectedDefault.level,
      source: 'test',
      data: expectedDefault.data,
    };

    actual.should.deep.equal(JSON.stringify(expected));
  });

  it('should format stack traces', function () {
    data.data = new Error('Whoops!');
    const actual = layout({})(data);
    actual.should.contain('"data":"Error: Whoops!\\n    at Context.<anonymous>');
  });

  it('should ignore invalid included properties', function () {
    expected = JSON.stringify({ data: expected.data });
    const actual = layout({ include: ['data', 'fake'] })(data);
    actual.should.deep.equal(expected);
  });

  it('should remove logger property', function () {
    data.logger = 'bla,bla,bla';
    const actual = layout({})(data);
    actual.should.deep.equal(JSON.stringify(expected));
  });

  it('should change levelStr to level', function () {
    const actual = layout({})(data);
    actual.should.deep.equal(JSON.stringify(expected));
  });

  it('should pick specific keys', function () {
    const actual = layout({
      include: ['level', 'data'],
    })(data);
    actual.should.deep.equal(JSON.stringify({ level: expected.level, data: expected.data }));
  });

  it('should format data', function () {
    data.data = ['%s', 'aaa'];
    const actual = JSON.parse(layout({})(data));
    actual.data.should.equal('aaa');
  });

  it('should format many params', function () {
    data.data = ['%s_%s', 'aaa', 'bbb'];
    const actual = JSON.parse(layout({})(data));
    actual.data.should.equal('aaa_bbb');
  });

  it('should format data + support object', function () {
    data.data = ['%s', 'aaa', { a: 1 }];
    const actual = JSON.parse(layout({})(data));
    actual.data.should.equal('aaa');
    actual.a.should.equal(1);
  });

  it('should format many params + support objects', function () {
    data.data = ['%s_%s', 'aaa', 'bbb', { a: 1 }, { b: 2 }];
    const actual = JSON.parse(layout({})(data));
    actual.data.should.equal('aaa_bbb');
    actual.a.should.equal(1);
    actual.b.should.equal(2);
  });

  it('should format data when passed as message + object', function () {
    data.data = ['aaa', { id: 123 }];
    const actual = JSON.parse(layout({})(data));
    actual.id.should.equal(123);
    actual.data.should.equal('aaa');
  });

  it('should format data when passed as message + many objects', function () {
    data.data = ['aaa', { id: 123 }, { bb: 222 }];
    const actual = JSON.parse(layout({})(data));
    actual.id.should.equal(123);
    actual.bb.should.equal(222);
    actual.data.should.equal('aaa');
  });

  it('should format data when passed as object with default msg param', function () {
    data.data = [{ id: 123, msg: 'aaa' }];
    const actual = JSON.parse(layout({})(data));
    actual.id.should.equal(123);
    actual.data.should.equal('aaa');
  });

  it('should format data when passed as object with different msg param', function () {
    data.data = [{ id: 123, data: 'aaa' }];
    const actual = JSON.parse(layout({ messageParam: 'data' })(data));
    actual.id.should.equal(123);
    actual.data.should.equal('aaa');
  });

  it('should add static fields when configured', function () {
    data.data = [{ id: 123, data: 'aaa' }];
    const actual = JSON.parse(layout({
      static: { appName: 'testapp', source: 'development' },
    })(data));
    actual.id.should.equal(123);
    actual.data.should.equal('aaa');
    actual.appName.should.equal('testapp');
    actual.source.should.equal('development');
  });

  it('should add dynamic fields when configured', function () {
    data.data = [{ id: 123, data: 'aaa' }];

    // eslint-disable-next-line lodash/prefer-constant
    const getTransactionId = () => 'tx-id';

    // eslint-disable-next-line lodash/prefer-constant
    const getIsAdmin = () => true;

    // eslint-disable-next-line lodash/prefer-constant
    const getCountLogin = () => 10;

    const actual = JSON.parse(layout({
      dynamic: {

        // Supported
        transactionId: getTransactionId,
        isAdmin: getIsAdmin,
        countLogin: getCountLogin,

        // Function with arguements not supported
        someArg: x => x,

        // Non string/number/boolean returning functions not supported
        nonSupportedReturn: () => new Date(),

      } })(data));
    actual.should.deep.equal({ startTime: '615 Ludlam Place, Nicholson, New Mexico, 5763', categoryName: '572efdaaa64be9dbc56369ae', level: 'INFO', transactionId: getTransactionId(), isAdmin: getIsAdmin(), countLogin: getCountLogin(), id: 123, data: 'aaa' });
  });

  it('should still pick specific keys when static fields are configured', function () {
    const actual = layout({
      static: { appName: 'testapp' },
      include: ['level', 'data'],
    })(data);
    actual.should.deep.equal(JSON.stringify({ level: expected.level, data: expected.data }));
  });
});
