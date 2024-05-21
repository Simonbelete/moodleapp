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

import { Component, Input } from '@angular/core';
import { CoreCategoryData } from '../../services/courses';
import { CoreNavigator } from '@services/navigator';

/**
 * This component is meant to display a category as a card.
 */
@Component({
    selector: 'core-courses-category-card',
    templateUrl: 'core-courses-category-card.html',
    styleUrls: ['category-card.scss'],
})
export class CategoryCardComponent  {

    @Input() category!: CoreCategoryData; // The category.
    @Input() showOnlyEnrolled = false;

    /**
     * Open a category.
     *
     * @param categoryId Category Id.
     */
    openCategory(categoryId: number): void {
        CoreNavigator.navigateToSitePath(
            'courses/categories/' + categoryId,
            { params: {
                enrolled: this.showOnlyEnrolled,
            } },
        );
    }

}