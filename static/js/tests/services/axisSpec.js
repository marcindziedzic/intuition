describe("Axis Specification", function () {

    var _axis;
    var _factoryFn;

    beforeEach(module('main'));

    beforeEach(inject(function (axis) {
        _axis = axis;
        _factoryFn = function(val) { return { val: val }; };
    }));

    it('module defines axis module', function() {
        expect(_axis).toBeDefined();
    });

    it('should do nothing when old axis vals are not defined', function() {
        var oldAxisVals;
        _axis.update(null, oldAxisVals, null, null);

    });

    it('should do nothing when new axis values are not defined', function() {
        var newAxisVals;
        _axis.update(newAxisVals, null, null, null);
    });

    it('should not change new and old axis when performing update', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['tuesday', 'wednesday'];
        var _axisStruct = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _axis.update(_newAxisVals, _oldAxisVals, _axisStruct, null);

        expect(_oldAxisVals).toEqual(['monday', 'tuesday', 'wednesday']);
        expect(_newAxisVals).toEqual(['tuesday', 'wednesday']);
    });

    it('should rename axis structure when new and old axises have eq length', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['saturday', 'sunday', 'wednesday'];
        var _axisStruct = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _axis.update(_newAxisVals, _oldAxisVals, _axisStruct, null);

        expect(_axisStruct).toEqual([
            { val: 'saturday' },
            { val: 'sunday' },
            { val: 'wednesday' }
        ]);
    });

    it('should remove items not defined in new axis', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        var _newAxisVals = ['tuesday', 'friday', 'saturday'];
        var _axisStruct = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' },
            { val: 'thursday' },
            { val: 'friday' },
            { val: 'saturday' },
            { val: 'sunday' }
        ];

        _axis.update(_newAxisVals, _oldAxisVals, _axisStruct, null);

        expect(_axisStruct).toEqual([
            { val: 'tuesday' },
            { val: 'friday' },
            { val: 'saturday' }
        ]);
    });

    it('should push new items into the axis of a board', function () {
        var _oldAxisVals = ['monday', 'tuesday', 'wednesday'];
        var _newAxisVals = ['sunday', 'monday', 'saturday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        var _axisStruct = [
            { val: 'monday' },
            { val: 'tuesday' },
            { val: 'wednesday' }
        ];

        _axis.update(_newAxisVals, _oldAxisVals, _axisStruct, _factoryFn);

        expect(_axisStruct).toEqual([
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
        var struct = _axis.createStruct('monday', function() { return 100 });
        expect(struct).toEqual({
            'id': 100,
            'val': 'monday'
        });
    });

    it('should transform simple array into axis structure', function() {
        var _axisArray = ['monday', 'tuesday', 'wednesday'];

        var _axisStructure = _axis.transformIntoStruct(_axisArray, _factoryFn);

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

        var _axisArray = _axis.transformIntoArray(_axisStructure);

        expect(_axisArray).toEqual(['monday', 'tuesday', 'wednesday']);
    });

});
