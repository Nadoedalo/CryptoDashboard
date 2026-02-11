import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';

import ToastWrapper from '~/components/ui/notification/ToastWrapper.vue';
import UiNotificationToastItem from '~/components/ui/notification/ToastItem.vue';
import { useToastNotificationStore, NOTIFICATION_TYPES } from '@stores/ToastNotificationStore';

/**
 * This test populates the Toast Pinia store with three notifications
 * (error, success, warning) and renders the ToastWrapper to compare
 * its markup with a snapshot.
 */
describe('ToastWrapper', () => {
  let pinia: ReturnType<typeof createTestingPinia>;
  beforeEach(() => {
    // fresh testing pinia for each test
    pinia = createTestingPinia({ stubActions: false, createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders toasts from the store and matches snapshot', async () => {
    const toastStore = useToastNotificationStore();

    toastStore.addToast({ text: 'Something went wrong', type: NOTIFICATION_TYPES.ERROR });
    toastStore.addToast({ text: 'Operation successful', type: NOTIFICATION_TYPES.SUCCESS });
    toastStore.addToast({ text: 'Be careful!', type: NOTIFICATION_TYPES.WARNING });

    const wrapper = await mountSuspended(ToastWrapper, {
      global: {
        // Inject Pinia so the component uses the same store instance
        plugins: [pinia],
        // Register child component to render items properly
        components: { UiNotificationToastItem },
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
