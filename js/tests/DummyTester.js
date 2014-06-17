describe('DummyTester', function(){

    var dummyService;

    beforeEach(function () {
        module('2048-app');

        inject(function ($injector) {
            dummyService = $injector.get('DummyService');
        });
    });

    describe("DummyService", function() {

        it("should return {dummy: 1}", function () {
            expect(dummyService.dummy).toEqual(1);
        });

    })

});