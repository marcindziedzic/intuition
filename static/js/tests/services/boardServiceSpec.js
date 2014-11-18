
describe("Board Service Specification", function () {
    var _boardService;

    beforeEach(module('main'));

    beforeEach(inject(function (boardService) {
        _boardService = boardService
    }));

    it('should contains boardService', function() {
        expect(_boardService).toBeDefined();
    });
});
