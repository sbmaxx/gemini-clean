gemini.suite('parent', function(suite) {
    suite
        .capture('plain')
        .capture('hovered')
        .capture('pressed');

    gemini.suite('child', function(child) {
        child
            .capture('plain')
            .capture('hovered');

        gemini.suite('grandChild', function(grandChild) {
            grandChild
                .capture('plain')
                .capture('pressed');
        });
    });
});
