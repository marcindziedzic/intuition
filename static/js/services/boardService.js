
app.factory('boardService', function () {
        return {
            getAllUsers: function () {
                return [
                    { firstName: 'Jane', lastName: 'Doe', age: 29 },
                    { firstName: 'John', lastName: 'Doe', age: 32 }
                ];
            }
        };
    }
);
