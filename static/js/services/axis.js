// TODO add support for undefined (all removed, all added)
// TODO this should be a real object with methods, learn how to define one
// TODO most probably I do not need old value array for calculations
app.factory('axis', function () {
        return {

            update: function (newValue, oldValue, axis, createStructFn) {

                if (_.isUndefined(oldValue)) {
                    return;
                }

                if (_.isUndefined(newValue)) {
                    return;
                }

                // rename
                if (oldValue.length == newValue.length) {
                    for (var i = 0; i < newValue.length; i++) {
                        var itemValue = newValue[i];
                        var struct = axis[i];

                        if (itemValue != struct.val) {
                            struct.val = itemValue;
                        }
                    }
                }

                // element removed
                if (oldValue.length > newValue.length) {
                    var removedStructs = _.filter(axis, function (struct) {
                        // TODO cover with tests and replace with _.contains
                        var contains = false;
                        for (var i = 0; i < newValue.length; i++) {
                            var itemValue = newValue[i];
                            if (struct.val == itemValue.toString()) {
                                contains = true;
                                break;
                            }
                        }
                        return contains == false;
                    });

                    for (var i = 0; i < removedStructs.length; i++) {
                        var struct = removedStructs[i];
                        axis.splice(axis.indexOf(struct), 1);
                    }
                }

                // element added
                if (newValue.length > oldValue.length) {

                    for (var i = 0; i < newValue.length; i++) {

                        var itemValue = newValue[i];
                        var struct = axis[i];

                        if (_.isUndefined(struct)) {
                            var newStruct = createStructFn(itemValue);
                            axis.splice(i, 0, newStruct);
                        } else if (itemValue != struct.val) {
                            var newStruct = createStructFn(itemValue);

                            // rename element in complex structure
                            var newStructVal = struct.val.replace(itemValue, '');
                            struct.val = newStructVal.trim();

                            axis.splice(i, 0, newStruct);
                        }
                    }
                }
                ;
            },

            createStruct: function (val, generateId) {
                return {
                    'id': generateId(),
                    'val': val
                };
            },

            transformIntoStruct: function (axis, createStructure) {
                return _.map(axis, function(val) { return createStructure(val); });
            },

            transformIntoArray: function (structs) {
                return _.map(structs, function(s) { return s.val; });
            }

        };
    }
);
