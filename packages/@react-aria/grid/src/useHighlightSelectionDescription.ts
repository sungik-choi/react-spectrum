/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaLabelingProps} from '@react-types/shared';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {MultipleSelectionManager} from '@react-stately/selection';
import {useDescription} from '@react-aria/utils';
import {useInteractionModality} from '@react-aria/interactions';
import {useMemo} from 'react';
import {useMessageFormatter} from '@react-aria/i18n';

interface UseHighlightSelectionDescriptionProps {
  selectionManager: MultipleSelectionManager,
  hasItemActions?: boolean
}

/**
 * Computes the description for a grid selectable collection.
 * @param props
 */
export function useHighlightSelectionDescription(props: UseHighlightSelectionDescriptionProps): AriaLabelingProps {
  let formatMessage = useMessageFormatter(intlMessages);
  let modality = useInteractionModality();
  // null is the default if the user hasn't interacted with the table at all yet or the rest of the page
  let shouldLongPress = (modality === 'pointer' || modality === 'virtual' || modality == null) && 'ontouchstart' in window;

  let interactionDescription = useMemo(() => {
    let selectionMode = props.selectionManager.selectionMode;
    let selectionBehavior = props.selectionManager.selectionBehavior;

    let message = undefined;
    if (shouldLongPress) {
      message = formatMessage('longPressToSelect');
    }

    return selectionBehavior === 'replace' && selectionMode !== 'none' && props.hasItemActions ? message : undefined;
  }, [props.selectionManager.selectionMode, props.selectionManager.selectionBehavior, props.hasItemActions, formatMessage, shouldLongPress]);

  let descriptionProps = useDescription(interactionDescription);
  return descriptionProps;
}
