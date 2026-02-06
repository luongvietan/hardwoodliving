import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageValue } from './types';
import { dataset, projectId } from './client';

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
});

export const urlFor = (source: SanityImageValue) => {
    return imageBuilder.image(source);
};
