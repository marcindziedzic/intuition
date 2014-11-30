describe("Comments on board", function () {

    var comments;

    beforeEach(inject(function () {
        comments = new CommentsSupport();

        var cells = [
            { x: 1, y:2, comment: 'First comment' },
            { x: 2, y:3 },
            { x: 3, y:4, comment: 'Second comment' }
        ];

        comments.init(cells);
    }));

    it("comment can be retrieved by id", function () {
        expect(comments.getById('1_2')).toBe('First comment');
        expect(comments.getById('2_3')).toBeNull();
        expect(comments.getById('3_4')).toBe('Second comment');
    });

    it("comment can be retrieved by cords", function () {
        expect(comments.getByCords(1,2)).toBe('First comment');
        expect(comments.getByCords(2,3)).toBe(undefined);
        expect(comments.getByCords(3,4)).toBe('Second comment');
    });

    it("if comment exists it is added to the cell", function() {
        var cell = { x: 1, y:2 };
        comments.extend(cell);
        expect(cell).toEqual({ x: 1, y:2, comment: 'First comment' });
    });

    it("if comment doesn't exist cell is not modified", function() {
        var cell = { x: 2, y:3 };
        comments.extend(cell);
        expect(cell).toEqual({ x: 2, y:3 });
    });

    it("comments is not updated by empty or undefined comment", function() {
        var id = '2_3';

        comments.update(id, null);
        expect(comments.getById('2_3')).toBeNull();

        comments.update(id, "");
        expect(comments.getById('2_3')).toBeNull();

        comments.update(id, undefined);
        expect(comments.getById('2_3')).toBeNull();
    });

    it("not existing comments is replaced by new comment", function() {
        var id = '2_3';

        comments.update(id, 'Third comment');
        expect(comments.getById('2_3')).toBe('Third comment');
    });

    it("comment is removed when empty or undefined comment is passed", function() {
        comments.update('1_2', '');
        expect(comments.getById('1_2')).toBeNull();

        comments.update('3_4', undefined);
        expect(comments.getById('3_4')).toBeNull();
    });

});
