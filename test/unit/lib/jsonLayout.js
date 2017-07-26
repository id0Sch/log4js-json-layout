const chai = require('chai');

chai.should();

const layout = require('../../../lib/jsonLayout');

const expected = {
  startTime: '615 Ludlam Place, Nicholson, New Mexico, 5763',
  categoryName: '572efdaaa64be9dbc56369ae',
  level: 'INFO',
  data: 'Deserunt mollit nisi ipsum ipsum ea quis in eiusmod ipsum officia labore qui amet. Cupidatat ut do Lorem ad veniam irure proident enim aliqua nisi aliquip velit voluptate. Laborum minim occaecat commodo nulla labore ex ullamco. Eu incididunt quis quis Lorem do nostrud enim consectetur. Voluptate in occaecat proident aliqua Lorem pariatur officia dolor.\r\n',
};

describe('log4js-json-layout', function () {
  let data;

  beforeEach(function () {
    data = {
      level: { levelStr: 'INFO' },
      categoryName: '572efdaaa64be9dbc56369ae',
      startTime: '615 Ludlam Place, Nicholson, New Mexico, 5763',
      data: 'Deserunt mollit nisi ipsum ipsum ea quis in eiusmod ipsum officia labore qui amet. Cupidatat ut do Lorem ad veniam irure proident enim aliqua nisi aliquip velit voluptate. Laborum minim occaecat commodo nulla labore ex ullamco. Eu incididunt quis quis Lorem do nostrud enim consectetur. Voluptate in occaecat proident aliqua Lorem pariatur officia dolor.\r\n',
    };
  });

  it('should return all items', function () {
    const output = layout({})(data);
    output.should.be.deep.equal(JSON.stringify(expected));
  });

  it('should remove logger property', function () {
    data.logger = 'bla,bla,bla';
    const output = layout({})(data);
    output.should.be.deep.equal(JSON.stringify(expected));
  });

  it('should change levelStr to level', function () {
    const output = layout({})(data);
    output.should.be.deep.equal(JSON.stringify(expected));
  });

  it('should pick specific keys', function () {
    const output = layout({
      include: ['level', 'data'],
    })(data);
    output.should.be.deep.equal(JSON.stringify({ level: expected.level, data: expected.data }));
  });

  it('should format data', function () {
    data.data = ['%s', 'aaa'];
    const output = JSON.parse(layout({})(data));
    output.data.should.equal('aaa');
  });

  it('should format many params', function () {
    data.data = ['%s_%s', 'aaa', 'bbb'];
    const output = JSON.parse(layout({})(data));
    output.data.should.equal('aaa_bbb');
  });

  it('should format data + support object', function () {
    data.data = ['%s', 'aaa', { a: 1 }];
    const output = JSON.parse(layout({})(data));
    output.data.should.equal('aaa');
    output.a.should.equal(1);
  });

  it('should format many params + support objects', function () {
    data.data = ['%s_%s', 'aaa', 'bbb', { a: 1 }, { b: 2 }];
    const output = JSON.parse(layout({})(data));
    output.data.should.equal('aaa_bbb');
    output.a.should.equal(1);
    output.b.should.equal(2);
  });

  it('should format data when passed as message + object', function () {
    data.data = ['aaa', { id: 123 }];
    const output = JSON.parse(layout({})(data));
    output.id.should.equal(123);
    output.data.should.equal('aaa');
  });

  it('should format data when passed as message + many objects', function () {
    data.data = ['aaa', { id: 123 }, { bb: 222 }];
    const output = JSON.parse(layout({})(data));
    output.id.should.equal(123);
    output.bb.should.equal(222);
    output.data.should.equal('aaa');
  });

  it('should format data when passed as object with default msg param', function () {
    data.data = [{ id: 123, msg: 'aaa' }];
    const output = JSON.parse(layout({})(data));
    output.id.should.equal(123);
    output.data.should.equal('aaa');
  });

  it('should format data when passed as object with different msg param', function () {
    data.data = [{ id: 123, data: 'aaa' }];
    const output = JSON.parse(layout({ messageParam: 'data' })(data));
    output.id.should.equal(123);
    output.data.should.equal('aaa');
  });
});
