describe("Colors on cell level", function () {

    var colors;

    beforeEach(inject(function () {
        colors = new ColorsSupport();

        var colorScheme = ['neutral', 'red', 'green', 'blue'];
        var cells = [
            { x: 1, y: 2, val: 'green' },
            { x: 2, y: 3 }
        ];

        colors.init(colorScheme, cells);
    }));

    it("neutral is a default color", function () {
        expect(colors.getById('2_3')).toBe('neutral');
        expect(colors.getByCords(2,3)).toBe('neutral');
    });

    it("defined color can be retrieved by id or cords", function () {
        expect(colors.getById('1_2')).toBe('green');
        expect(colors.getByCords(1,2)).toBe('green');
    });

    it("if comment exists it is added to the cell", function() {
        var cell = { x: 1, y:2 };
        colors.extend(cell);
        expect(cell).toEqual({ x: 1, y:2, val: 'green' });
    });

    it("if comment doesn't exist cell is not modified", function() {
        var cell = { x: 2, y:3 };
        colors.extend(cell);
        expect(cell).toEqual({ x: 2, y:3 });
    });

    it("colors are updated according to sequence defined in color scheme", function() {
        var id = '2_3';

        colors.update(id, 'neutral');
        expect(colors.getById(id)).toBe('red');

        colors.update(id, 'red');
        expect(colors.getById(id)).toBe('green');

        colors.update(id, "green");
        expect(colors.getById(id)).toBe('blue');

        colors.update(id, "blue");
        expect(colors.getById(id)).toBe('neutral');
    });

    it("passing wrong color results in update to default color", function() {
        var id = '2_3';

        colors.update(id, 'black');
        expect(colors.getById(id)).toBe('neutral');
    });

});
