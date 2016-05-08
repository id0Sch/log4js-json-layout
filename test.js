/**
 * Created by idoschachter on 08/05/2016.
 */
'use strict';
var chai = require('chai');

chai.should();

var layout = require('./lib/jsonLayout');


describe('log4js-json-layout', function () {
    var data;
    beforeEach(function () {
        data = {
            "_id": "572efdaaa64be9dbc56369ae",
            "index": 0,
            "guid": "7091cb87-73d3-477a-ad7f-aca51fc96a2f",
            "isActive": false,
            "balance": "$1,262.05",
            "picture": "http://placehold.it/32x32",
            "age": 28,
            "eyeColor": "brown",
            "name": "Olivia Colon",
            "gender": "female",
            "company": "INRT",
            "email": "oliviacolon@inrt.com",
            "phone": "+1 (983) 583-2652",
            "address": "615 Ludlam Place, Nicholson, New Mexico, 5763",
            "about": "Deserunt mollit nisi ipsum ipsum ea quis in eiusmod ipsum officia labore qui amet. Cupidatat ut do Lorem ad veniam irure proident enim aliqua nisi aliquip velit voluptate. Laborum minim occaecat commodo nulla labore ex ullamco. Eu incididunt quis quis Lorem do nostrud enim consectetur. Voluptate in occaecat proident aliqua Lorem pariatur officia dolor.\r\n"
        };
    });

    it('should return all items', function () {
        var output = layout({})(data);
        output.should.be.deep.equal(JSON.stringify(data));
    });
    it('should remove logger property', function () {
        data.logger = "bla,bla,bla";
        var output = layout({})(data);
        output.should.be.deep.equal(JSON.stringify(data));
    });
    it('should change levelStr to level', function () {
        data.level = {
            levelStr: 'myLevel'
        };
        var output = layout({})(data);
        output.should.be.deep.equal(JSON.stringify(data));
    });
    it('should pick specific keys', function () {
        var output = layout({
            include: ['about', 'address']
        })(data);
        output.should.be.deep.equal(JSON.stringify({about: data.about, address: data.address}));
    })
});