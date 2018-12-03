Run opsplitsen







Removed from profiler.js, as no IO input is used.

    // Feed mouse events as VM I/O events.
    document.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        const coordinates = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', coordinates);
    });
    canvas.addEventListener('mousedown', e => {
        const rect = canvas.getBoundingClientRect();
        const data = {
            isDown: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', data);
        e.preventDefault();
    });
    canvas.addEventListener('mouseup', e => {
        const rect = canvas.getBoundingClientRect();
        const data = {
            isDown: false,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            canvasWidth: rect.width,
            canvasHeight: rect.height
        };
        Scratch.vm.postIOData('mouse', data);
        e.preventDefault();
    });

    // Feed keyboard events as VM I/O events.
    document.addEventListener('keydown', e => {
        // Don't capture keys intended for Blockly inputs.
        if (e.target !== document && e.target !== document.body) {
            return;
        }
        console.log(e);
        console.log(e.keyCode);
        Scratch.vm.postIOData('keyboard', {
            keyCode: e.keyCode,
            isDown: true
        });
        e.preventDefault();
    });
    document.addEventListener('keyup', e => {
        // Always capture up events,
        // even those that have switched to other targets.
        console.log(e);
        console.log(e.keyCode);
        Scratch.vm.postIOData('keyboard', {
            keyCode: e.keyCode,
            isDown: false
        });
        // E.g., prevent scroll.
        if (e.target !== document && e.target !== document.body) {
            e.preventDefault();
        }
    });

    ---

    TODO Checkout VM functions:
    key: "_onAnswer",
        value: function(A) {
            this._answer = A;
            var e = this._questionList.shift();
            if (e) {
                var n = t(e, 5),
                    l = (n[0], n[1]),
                    r = n[2],
                    a = n[3],
                    i = n[4];
                a && !i && this.runtime.emit("SAY", r, "say", ""), l(), this._askNextQuestion()
            }
        }
    }, {
        key: "_resetAnswer",
        value: function() {
            this._answer = ""
        }
    }, {
        key: "_enqueueAsk",
        value: function(A, e, n, t, l) {
            this._questionList.push([A, e, n, t, l])
        }
    }, {
        key: "_askNextQuestion",
        value: function() {
            if (this._questionList.length > 0) {
                var A = t(this._questionList[0], 5),
                    e = A[0],
                    n = (A[1], A[2]),
                    l = A[3],
                    r = A[4];
                l && !r ? (this.runtime.emit("SAY", n, "say", e), this.runtime.emit("QUESTION", "")) : this.runtime.emit("QUESTION", e)
            }
        }
    }, {
        key: "_clearAllQuestions",
        value: function() {
            this._questionList = [], this.runtime.emit("QUESTION", null)
        }
    }, {
        key: "askAndWait",
        value: function(A, e) {
            var n = this,
                t = e.target;
            return new Promise(function(e) {
                var l = n._questionList.length > 0;
                n._enqueueAsk(String(A.QUESTION), e, t, t.visible, t.isStage), l || n._askNextQuestion()
            })
        }
    }, {
        key: "getAnswer",
        value: function() {
            return this._answer
        }