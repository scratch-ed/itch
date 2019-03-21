class Dodona {
    constructor() {
        this.hasOpenTab = false;
        this.hasOpenContext = false;
        this.hasOpenCase = false;
        this.hasOpenTest = false;
    }

    addMessage(message) {
        window.appendMessage(message);
    }

    startTestTab(name) {
        if (this.hasOpenTab) {
            this.closeTestTab();
        }
        window.startTab(name);
        this.hasOpenTab = true;
    }

    closeTestTab() {
        if (this.hasOpenContext) {
            this.closeTestContext();
        }
        window.closeTab();
        this.hasOpenTab = false;
    }

    startTestContext() {
        if (!this.hasOpenTab) {
            this.startTestTab('Tests');
        }
        window.startContext();
        this.hasOpenContext = true;
    }

    closeTestContext() {
        if (this.hasOpenCase) {
            this.closeTestCase();
        }
        window.closeContext();
        this.hasOpenContext = false;
    }

    startTestCase(description) {
        if (!this.hasOpenContext) {
            this.startTestContext()
        }
        if (this.hasOpenCase) {
            this.closeTestCase();
        }
        window.startTestcase(description);
        this.hasOpenCase = true;
    }

    closeTestCase() {
        window.closeTestcase();
        this.hasOpenCase = false;
    }

    startTest(expected) {
        if (!this.hasOpenCase) {
            this.startTestCase();
        }
        window.startTest(expected);
        this.hasOpenTest = true;
    }

    closeTest(generated, status) {
        window.closeTest(generated, status);
        this.hasOpenTest = false;
    }

}

const dodona = new Dodona();