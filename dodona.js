//
// Message
//

class Message {

    constructor(properties) {

        this._properties = Object.assign(
            // set default values
            {
                description: "",
                format: "text"
            },
            // overwrite with specific values
            properties
        );

    }

    toJson() {
        return this._properties;
    }

}

//
// Test
//

class Test {

    constructor(properties, parent) {

        // TODO: check object properties using JSON schema
        //
        // base
        //     description: string or message
        //     messages: array of messages
        //     data: object
        // acceptance
        //     accepted (required): boolean
        //     status (required): string
        //     score: float (>= 0.0)
        //     maximal_score: float (>= 0.0)
        // outcome
        //     expected
        //     generated

        // set parent
        this._parent = parent || null;

        // set object properties
        this._properties = {}
        // set default properties and overwrite with specific values
        this.setStatus("unprocessed").setProperties(properties);

    }

    hasParent() {

        return this._parent !== null;

    }

    get parent() {

        return this._parent;

    }

    set parent(parent) {

        // set parent
        this._parent = parent;

        // return object for chaining purposes
        return this;

    }

    hasProperty(name) {

        // check if object has a property with the given name
        return this._properties.hasOwnProperty(name);

    }

    getProperty(name) {

        // check if object has a property with the given name
        if (this.hasProperty(name)) {
            return this._properties[name];
        }

        // report that object has no property with the given name
        throw new Error(`unknown property "${name}"`);
    }

    setAccepted(value) {

        // set acceptance of current object
        this._properties.accepted = value;

        // recursively call function on parent
        if (this.hasParent()) {
            this.parent.setAccepted(value);
        }

        // return object for chaining purposes
        return this;

    }

    setStatus(value) {

        // define the order of severity of status codes
        const statusCodes = [
            "unprocessed",
            "correct answer",
            "wrong answer",
            "runtime error",
            "segmentation error",
            "unexpected end of line",
            "memory limit exceeded",
            "time limit exceeded",
            "compilation error",
        ];

        // determine severity of given status
        const severity = statusCodes.indexOf(value);
        if (severity === -1) {
            throw new Error(`invalid status "${value}"`);
        }

        // determine current severity
        let currentSeverity = -1;
        if (this.hasProperty("status")) {
            currentSeverity = statusCodes.indexOf(this.getProperty("status"));
        }

        // update object status
        // NOTE: object status is only updated in case it was not set before or
        // in case it is more severe than the previous status
        if (currentSeverity === -1 || currentSeverity < severity) {

            this._properties.status = value;

        }

        // update object acceptance according to status
        this.setAccepted(this.getProperty("status") === "correct answer");

        // recursively call function on parent
        if (this.hasParent()) {
            this.parent.setStatus(value);
        }

        // return object for chaining purposes
        return this;

    }

    setProperty(name, value) {

        // delegate updating of properties status and accepted
        if (name === "status") {

            // set status
            return this.setStatus(value);

        } else if (name === "accepted") {

            // set acceptance
            return this.setAccepted(value);

        }

        // update object property
        this._properties[name] = value;

        // return object for chaining purposes
        return this;

    }

    setProperties(properties) {

        // set individual properties
        for (let property in properties) {
            this.setProperty(property, properties[property]);
        }

        // return object for chaining purposes
        return this;

    }

    deleteProperty(name) {

        if (this.hasProperty(name)) {
            delete this._properties[name];
        }

        // return object for chaining purposes
        return this;

    }

    hasMessages() {

        // add groups property if not present
        if (!this.hasProperty("messages")) {
            return false;
        }

        return this.getProperty("messages").length !== 0;

    }

    addMessage(message) {

        // add message property if not present
        if (!this.hasProperty("messages")) {

            // create new message property
            this.setProperty("messages", [message]);

        } else {

            // add message to list of messages
            this.getProperty("messages").push(message);

        }

        // return object for chaining purposes
        return this;

    }

    toJson() {

        // initialize JavaScript Object representation
        let json = {};

        // fill JavaScript Object with properties
        for (let property in this._properties) {

            if (["groups", "tests", "messages"].includes(property)) {

                // recursively call on array elements
                json[property] = this.getProperty(property).map(
                    element => element.toJson()
                );

            } else if (
                property === "description" &&
                typeof this.getProperty(property) === "object"
            ) {

                // reversively call on object
                json[property] = this.getProperty(property).toJson();

            } else {

                // add property as is
                json[property] = this.getProperty(property);

            }

        }

        // return JavaScript Object representation
        return json;

    }

    toString() {

        // stringify JavaScript Object representation
        return JSON.stringify(this.toJson(), null, 4);

    }

}


//
// TestGroup
//

class TestGroup extends Test {

    constructor(properties, parent) {

        // TODO: check object properties using JSON schema
        //
        // base
        //     description: string or message
        //     messages: array of messages
        //     data: object
        // acceptance
        //     accepted (required): boolean
        //     status (required): string
        //     score: float (>= 0.0)
        //     maximal_score: float (>= 0.0)
        // access
        //     permission: string (["student", "staff", "zeus", "admin"])
        // runtime metrics
        //     wall_time: float (>= 0.0)
        //     peak_memory: float (>= 0.0)
        // representation
        //     show_stacked
        //     show_merged
        //     show_accepted
        //     show_line_numbers
        //     toggle_accepted
        //     toggle_line_numbers
        // substructures
        //     groups
        //     tests

        // call super constructor
        super(properties, parent);

    }

    hasGroups() {

        // no groups if no groups property
        if (!this.hasProperty("groups")) {
            return false;
        }

        return this.groups.length !== 0;

    }

    get groups() {

        // check if there are any groups
        // NOTE: we cannot use hasGroups here because this also checks if the
        //       array of groups is empty
        if (!this.hasProperty("groups")) {
            throw new Error("no groups");
        }

        return this.getProperty("groups");

    };

    get lastGroup() {

        // no last group if no groups
        if (!this.hasGroups()) {
            throw new Error("no groups");
        }

        // no last group if array of groups is empty
        if (this.groups.length === 0) {
            throw new Error("no groups")
        }

        // return last group
        return this.groups[this.groups.length - 1];

    }

    addGroup(group) {

        // set parent of group
        group.parent = this;

        if (!this.hasProperty("groups")) {

            // add groups property if not present
            this.setProperty("groups", [group]);

        } else {

            // append group to existing list of groups
            this.groups.push(group);

        }

        // update status of test group according to status of group
        if (group.hasProperty("status")) {
            this.setStatus(group.getProperty("status"));
        }

        // update acceptance of test group according to acceptance of group
        if (group.hasProperty("accepted")) {
            this.setAccepted(group.getProperty("accepted"));
        }

        // return object for chaining purposes
        return this;

    }

    clearGroups() {

        if (this.hasProperty("groups")) {
            this.groups.length = 0;
        }

    }

    hasTests() {

        // no tests if no tests property
        if (!this.hasProperty("tests")) {
            return false;
        }

        return this.tests.length !== 0;

    }

    get tests() {

        // check if there are any tests
        // NOTE: we cannot use hasTests here because this also checks if the
        //       array of tests is empty
        if (!this.hasProperty("tests")) {
            throw new Error("no tests");
        }

        return this.getProperty("tests");

    };

    get lastTest() {

        // no last test if no tests
        if (!this.hasTests()) {
            throw new Error("no tests");
        }

        // get array of groups
        const tests = this.tests;

        // check if there are groups
        if (tests.length === 0) {
            throw new Error("no tests")
        }

        // return last test
        return tests[tests.length - 1];

    }

    addTest(test) {

        // set parent of test
        test.parent = this;

        if (!this.hasProperty("tests")) {

            // add tests property if not present
            this.setProperty("tests", [test]);

        } else {

            // append group to existing list of groups
            this.tests.push(test);

        }

        // update status of test group according to status of group
        if (test.hasProperty("status")) {
            this.setStatus(test.getProperty("status"));
        }

        // update acceptance of test group according to acceptance of group
        if (test.hasProperty("accepted")) {
            this.setAccepted(test.getProperty("accepted"));
        }

        // return object for chaining purposes
        return this;

    }

    clearTests() {

        if (this.hasProperty("tests")) {
            this.tests.length = 0;
        }

    }

    [Symbol.iterator]() {

        return {
            next: function() {

                if (this.index < this.array.length) {

                    this.index += 1;
                    return { value: this.array[this.index - 1], done: false };

                } else {

                    return { done: true };

                }

            },
            array: [].concat(this.hasGroups() ? this.groups : []),
            index: 0
        };

    }

}

//
// TestCase
//

class TestCase extends TestGroup {

    constructor(properties, parent) {

        // call super constructor
        super(properties, parent);

    };

    [Symbol.iterator]() {

        return {
            next: function() {

                if (this.index < this.array.length) {

                    this.index += 1;
                    return { value: this.array[this.index - 1], done: false };

                } else {

                    return { done: true };

                }

            },
            array: [].concat(this.hasTests() ? this.tests : []),
            index: 0
        };

    }

}

//
// Context
//

class Context extends TestGroup {

    constructor(properties, parent) {

        // call super constructor
        super(properties, parent);

    }

    addTestCase(testcase) {

        // return object for chaining purposes
        return this.addGroup(testcase || new TestCase());

    }

    addTest(test) {

        // make sure context contains at least one testcase
        if (!this.hasGroups()) {
            this.addTestCase();
        }

        // add test to last testcase
        this.lastGroup.addTest(test);

        // return object for chaining purposes
        return this;

    }

}

//
// Tab
//

class Tab extends TestGroup {

    constructor(properties, parent) {

        // call super constructor
        super(properties, parent);

    }

    addContext(context) {

        // return object for chaining purposes
        return this.addGroup(context || new Context());

    }

    addTestCase(testcase) {

        // make sure tab contains at least one context
        if (!this.hasGroups()) {
            this.addContext();
        }

        // add testcase to last context
        this.lastGroup.addTestCase(testcase);

        // return object for chaining purposes
        return this;

    }

    addTest(test) {

        // make sure tab contains at least one context
        if (!this.hasGroups()) {
            this.addContext();
        }

        // add test to last context
        this.lastGroup.addTest(test);

        // return object for chaining purposes
        return this;

    }

}

//
// Submission
//

class Submission extends TestGroup {

    constructor(properties) {

        // call super constructor
        super(properties);

    };

    addTab(tab) {

        // return object for chaining purposes
        return this.addGroup(tab || new Tab());

    }

    addContext(context) {

        // make sure submission contains at least one tab
        if (!this.hasGroups()) {
            this.addTab();
        }

        // add context to last group (tab)
        this.lastGroup.addContext(context);

        // return object for chaining purposes
        return this;

    }

    addTestCase(testcase) {

        // make sure submission contains at least one tab
        if (!this.hasGroups()) {
            this.addTab();
        }

        // add context to last group (tab)
        this.lastGroup.addTestCase(testcase);

        // return object for chaining purposes
        return this;

    }

    addTest(test) {

        // make sure submission contains at least one tab
        if (!this.hasGroups()) {
            this.addTab();
        }

        // add test to tab
        this.lastGroup.addTest(test);

        // return object for chaining purposes
        return this;

    }

}

module.exports = {
    Message: Message,
    Submission: Submission,
    Tab: Tab,
    Context: Context,
    TestCase: TestCase,
    Test: Test
};
