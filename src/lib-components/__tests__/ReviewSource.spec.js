import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ReviewSource from '../ReviewSource.vue'

describe('ReviewSource', () => {
  it('renders properly', () => {
    const wrapper = mount(ReviewSource, {
      props: {
        source: {
          class: "Integer",
          caption: "Age",
          description: "<b>Description of Age</b>",
          name: "Age",
          defaultValue: 71,
          multiValued: false,
          value: 71,
          type: "Age",
          requestCondition: "!is_known('Age')",
          path: "EDACS7:Registration:Age",
          design: "EDACS7:Registration:Age",
          requested: false
        },
        disabled: false,
        value: 0,
        suffix: '',
        showDescriptionInline: false,
        hideEraser: false,
        useButtons: false,
        hideCaption: false,
      }
    });
    expect(wrapper.text()).toContain('Age');
  })
})
