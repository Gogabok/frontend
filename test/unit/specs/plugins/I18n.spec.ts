import { expect } from 'chai';

import I18n from 'plugins/I18n';


describe('I18n.ts', () => {


    describe('init()', () => {

        it('correctly initializes vue-i18n plugin' +
           'with russian language', () => {
            return I18n.init(['ru']).then((i18n) => {
                expect(Object.keys(i18n.getLocaleMessage('ru')))
                    .to.be.an('array')
                    .and.not.be.empty;
            });
        });

        it('correctly initializes vue-i18n plugin with default language ' +
           'on empty priority list', () => {
            return I18n.init([]).then((i18n) => {
                expect(Object.keys(
                    i18n.getLocaleMessage(I18n.defaultLocale),
                ))
                    .to.be.an('array')
                    .and.not.be.empty;
            });
        });

        it('correctly initializes vue-i18n plugin with default language ' +
           'on non-existing locale', () => {
            return I18n.init(['not_existing_language']).then((i18n) => {
                expect(Object.keys(
                    i18n.getLocaleMessage(I18n.defaultLocale),
                ))
                    .to.be.an('array')
                    .and.not.be.empty;
            });
        });

    });


    describe('loadLocaleDate()', () => {

        it('loads existing russian locale data correctly', () => {
            return I18n.loadLocaleData(['ru']).then((data) => {
                expect(Object.keys(data))
                    .to.not.be.empty;
            });
        });

    });


});
