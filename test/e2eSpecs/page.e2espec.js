describe('home page title', function() {
    var ptor = protractor.getInstance();
    it('should be bear-corp-mockingbird', function() {
        ptor.get('/#');
        expect(ptor.getTitle()).toBe('bear-corp-mockingbird');
    });
});
