describe("Board Service Specification", function () {

    var _boardService;
    var _factoryFn;

    beforeEach(module('main'));

    beforeEach(inject(function (boardService) {
        _boardService = boardService;
        _factoryFn = function(val) { return { val: val }; };
    }));

    it('module defines boardService', function() {
        expect(_boardService).toBeDefined();
    });

    it('should do nothing when old axis vals are not defined', function() {
        var oldAxisVals;
        _boardService.update(null, oldAxisVals, null, null);

    });

    it('should do nothing when new axis values are not defined', function() {
        var newAxisVals;
        _boardService.update(newAxisVals, null, null, null);
    });

    it('should not change new and old axis when performing update', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['tuesday', 'wednesday'];
        var _axis = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _boardService.update(_newAxisVals, _oldAxisVals, _axis, null);

        expect(_oldAxisVals).toEqual(['monday', 'tuesday', 'wednesday']);
        expect(_newAxisVals).toEqual(['tuesday', 'wednesday']);
    });

    it('should rename axis structure when new and old axises have eq length', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['saturday', 'sunday', 'wednesday'];
        var _axis = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _boardService.update(_newAxisVals, _oldAxisVals, _axis, null);

        expect(_axis).toEqual([
            { val: 'saturday' },
            { val: 'sunday' },
            { val: 'wednesday' }
        ]);
    });

    it('should remove items not defined in new axis', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        var _newAxisVals = ['tuesday', 'friday', 'saturday'];
        var _axis = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' },
            { val: 'thursday' },
            { val: 'friday' },
            { val: 'saturday' },
            { val: 'sunday' }
        ];

        _boardService.update(_newAxisVals, _oldAxisVals, _axis, null);

        expect(_axis).toEqual([
            { val: 'tuesday' },
            { val: 'friday' },
            { val: 'saturday' }
        ]);
    });

    it('should push new items into the axis of a board', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['sunday', 'monday', 'saturday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        var _axis = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _boardService.update(_newAxisVals, _oldAxisVals, _axis, _factoryFn);

        expect(_axis).toEqual([
            { val: 'sunday' },
            { val: 'monday' },
            { val: 'saturday' },
            { val: 'tuesday' },
            { val: 'wednesday' },
            { val: 'thursday' },
            { val: 'friday' }
        ]);
    });

    it('should generate structure holding new board axis', function() {
        var struct = _boardService.createStruct('monday', function() { return 100 });
        expect(struct).toEqual({
            'id': 100,
            'val': 'monday'
        });
    });

    it('should transform simple array into axis structure', function() {
        var _axis = ['monday', 'tuesday', 'wednesday'];

        var _axisStructure = _boardService.transformIntoStruct(_axis, _factoryFn);

        expect(_axisStructure).toEqual([
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ]);
    });

    it('should transform axis structure into simple array containing values', function() {
        var _axisStructure = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        var _axis = _boardService.transformIntoArray(_axisStructure);

        expect(_axis).toEqual(['monday', 'tuesday', 'wednesday']);
    });

});
