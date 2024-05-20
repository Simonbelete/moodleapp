// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component } from '@angular/core';
import { CoreLang } from '@services/lang';
import { CoreSiteCheckResponse, CoreSites } from '@services/sites';
import { CoreUtils } from '@services/utils/utils';
import { CoreEvents } from '@singletons/events';
import { CoreNavigator } from '@services/navigator';
import { CoreConstants } from '@/core/constants';
import { CoreSitePublicConfigResponse, CoreUnauthenticatedSite } from '@classes/sites/unauthenticated-site';
import { CoreSitesFactory } from '@services/sites-factory';

@Component({
    selector: 'page-core-app-language-preference.ts',
    templateUrl: 'preference.html',
    styleUrls: ['preference.scss'],
})
export class CoreLanguagePreferencePage {

    site!: CoreUnauthenticatedSite;
    siteName?: string;
    siteCheckError = '';
    siteConfig?: CoreSitePublicConfigResponse;
	languages: { code: string; name: string }[] = [];
	selectedLanguage = '';

    protected siteCheck?: CoreSiteCheckResponse;

	constructor() {
        this.asyncInit();
	}

    /**
     * Async part of the constructor.
     */
    protected async asyncInit(): Promise<void> {

        // Get the supported languages.
        const languages = CoreConstants.CONFIG.languages;
        for (const code in languages) {
            this.languages.push({
                code: code,
                name: languages[code],
            });
        }
        // Sort them by name.
        this.languages.sort((a, b) => a.name.localeCompare(b.name));
        this.selectedLanguage = await CoreLang.getCurrentLanguage();

        // Load Site Detail
        this.siteCheck = CoreNavigator.getRouteParam<CoreSiteCheckResponse>('siteCheck');

        const siteUrl = this.siteCheck?.siteUrl || CoreNavigator.getRequiredRouteParam<string>('siteUrl');
        if (this.siteCheck?.config) {
            this.siteConfig = this.siteCheck.config;
        }

        this.site = CoreSitesFactory.makeUnauthenticatedSite(siteUrl, this.siteConfig);
        this.siteName = await this.site.getSiteName();
    }

    /**
     * Called when a new language is selected.
     *
     * @param languageCode string
     */
    async languageChanged(languageCode: string): Promise<void> {
        this.selectedLanguage = languageCode;

        await CoreLang.changeCurrentLanguage(this.selectedLanguage);

        this.applyLanguageAndRestart();
	}

	/**
	 * Apply language changes and restart the app.
	 */
    protected async applyLanguageAndRestart(): Promise<void> {
        // Invalidate cache for all sites to get the content in the right language.
        const sites = await CoreSites.getSitesInstances();
        await CoreUtils.ignoreErrors(Promise.all(sites.map((site) => site.invalidateWsCache())));

        CoreEvents.trigger(CoreEvents.LANGUAGE_CHANGED, this.selectedLanguage);

        CoreNavigator.navigate('/login', {
            reset: true,
        });
    }

    async getStartedClick(): Promise<void> {
        CoreNavigator.navigate('/login', {
            reset: true,
        });
    }

}
