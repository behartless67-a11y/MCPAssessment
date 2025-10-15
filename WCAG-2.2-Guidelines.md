# WCAG 2.2 Guidelines Reference

**Version:** WCAG 2.2 (October 2023)
**Status:** W3C Recommendation
**Source:** [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## What's New in WCAG 2.2

WCAG 2.2 adds **9 new success criteria** to improve accessibility, particularly for users with cognitive and learning disabilities, mobile device users, and people with low vision.

All WCAG 2.1 and 2.0 success criteria are included in WCAG 2.2 (backward compatible).

---

## New Success Criteria in WCAG 2.2

### Level A (0 new criteria)
No new Level A criteria were added in WCAG 2.2.

### Level AA (5 new criteria)

#### 2.4.11 Focus Not Obscured (Minimum) - NEW ✨
**Level:** AA
**Guideline:** 2.4 Navigable

**Requirement:**
When a user interface component receives keyboard focus, the component is not entirely hidden by author-created content.

**What This Means:**
- When you tab to a button, link, or form field, it must be at least partially visible
- Sticky headers, footers, or cookie banners cannot completely cover focused elements
- At least some portion of the focus indicator must be visible

**Common Issues:**
- Fixed position headers covering focused elements at top of page
- Cookie consent banners hiding focused form fields
- Sticky navigation bars obscuring focused links

**How to Pass:**
```css
/* Ensure focused elements are not hidden */
.sticky-header {
  /* Use z-index carefully */
  z-index: 100;
}

/* Provide scroll padding to prevent obscuring */
html {
  scroll-padding-top: 100px; /* Height of sticky header */
}

/* Ensure focus indicators are visible */
:focus {
  position: relative;
  z-index: 1000; /* Above sticky elements */
}
```

**Testing:**
1. Use only keyboard to navigate (Tab key)
2. Check that focused elements are never completely hidden
3. Test with sticky headers, footers, and modal dialogs
4. Verify focus is visible when scrolling

---

#### 2.4.12 Focus Not Obscured (Enhanced) - NEW ✨
**Level:** AAA
**Guideline:** 2.4 Navigable

**Requirement:**
When a user interface component receives keyboard focus, no part of the component is hidden by author-created content.

**What This Means:**
- Stricter version of 2.4.11
- The ENTIRE focused component must be visible (not just partially)
- No overlapping content allowed

**Difference from 2.4.11:**
- **2.4.11 (AA):** At least partially visible
- **2.4.12 (AAA):** Completely visible

**How to Pass:**
```javascript
// Auto-scroll to ensure full visibility
element.addEventListener('focus', (e) => {
  e.target.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });
});
```

---

#### 2.4.13 Focus Appearance - NEW ✨
**Level:** AAA
**Guideline:** 2.4 Navigable

**Requirement:**
When the keyboard focus indicator is visible, an area of the focus indicator meets all of the following:
- Is at least as large as a 2 CSS pixel solid border around the component
- Has a contrast ratio of at least 3:1 against adjacent colors

**What This Means:**
- Focus indicators must be prominent and visible
- Minimum size: 2px solid border equivalent
- Must have 3:1 contrast ratio

**How to Pass:**
```css
/* Good focus indicator */
:focus {
  outline: 2px solid #E57200; /* UVA Orange */
  outline-offset: 2px;
}

/* Enhanced focus with background */
:focus {
  outline: 3px solid #232D4B; /* UVA Blue - high contrast */
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(35, 45, 75, 0.2);
}

/* For dark backgrounds */
.dark-bg :focus {
  outline: 3px solid #FFFFFF;
  outline-offset: 2px;
}
```

**Testing:**
- Check focus indicator size (at least 2px)
- Verify 3:1 contrast ratio with background
- Test on various background colors
- Use keyboard navigation throughout site

---

#### 2.5.7 Dragging Movements - NEW ✨
**Level:** AA
**Guideline:** 2.5 Input Modalities

**Requirement:**
All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging, unless dragging is essential.

**What This Means:**
- Don't require drag-and-drop as the only way to do something
- Provide alternative input methods (buttons, keyboard)
- Examples: sliders, sortable lists, drag-to-upload

**Common Uses:**
- File uploads (provide "Browse" button)
- Sortable lists (provide up/down buttons)
- Range sliders (provide text input)
- Drag-to-delete (provide delete button)

**How to Pass:**
```html
<!-- File Upload: Both drag-and-drop AND button -->
<div class="file-upload">
  <div class="drop-zone">
    Drag files here
  </div>
  <button type="button">Or click to browse</button>
  <input type="file" hidden>
</div>

<!-- Sortable List: Both drag AND buttons -->
<ul class="sortable-list">
  <li>
    Item 1
    <button aria-label="Move up">↑</button>
    <button aria-label="Move down">↓</button>
  </li>
</ul>

<!-- Range Slider: Both slider AND input -->
<label for="volume">Volume</label>
<input type="range" id="volume" min="0" max="100">
<input type="number" min="0" max="100" aria-label="Volume value">
```

**Exceptions (Essential):**
- Drawing or painting applications
- Handwriting recognition
- Gaming where dragging is core mechanic

---

#### 2.5.8 Target Size (Minimum) - NEW ✨
**Level:** AA
**Guideline:** 2.5 Input Modalities

**Requirement:**
The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except when:
- **Spacing:** The target is smaller but has sufficient spacing (24px) around it
- **Equivalent:** An equivalent target meets the size requirement
- **Inline:** The target is in a sentence or text block
- **User agent:** The size is determined by the user agent
- **Essential:** The particular presentation is essential

**What This Means:**
- Buttons, links, and interactive elements should be at least 24x24 pixels
- Or have 24px of spacing around them
- Makes targets easier to tap on mobile and for users with motor disabilities

**How to Pass:**
```css
/* Minimum target size */
button, a, input[type="checkbox"] {
  min-width: 24px;
  min-height: 24px;
  padding: 8px 16px; /* Increases touch target */
}

/* For smaller icons, add spacing */
.icon-button {
  width: 20px;
  height: 20px;
  padding: 12px; /* Total: 44x44px */
}

/* Checkbox/Radio with larger hit area */
input[type="checkbox"] {
  width: 24px;
  height: 24px;
}

/* Alternative: Use padding to increase target */
.small-link {
  font-size: 14px;
  padding: 10px; /* Creates larger tap target */
}
```

**Spacing Exception:**
```css
/* Small targets with adequate spacing */
.icon-grid button {
  width: 20px;
  height: 20px;
  margin: 12px; /* 24px total spacing */
}
```

**Inline Exception:**
Links within paragraphs don't need to meet the size requirement.

**Testing:**
- Measure interactive elements (DevTools)
- Test on mobile devices (finger-sized targets)
- Verify 24x24px minimum or adequate spacing
- Check that common controls (buttons, links, form fields) are easy to tap

---

#### 3.3.7 Redundant Entry - NEW ✨
**Level:** A
**Guideline:** 3.3 Input Assistance

**Requirement:**
Information previously entered by or provided to the user that is required to be entered again in the same process is either:
- Auto-populated, or
- Available for the user to select

**What This Means:**
- Don't make users re-enter information they already provided
- Use autocomplete, pre-fill, or dropdown selections
- Applies to multi-step forms and processes

**Common Scenarios:**
- Shipping = Billing address option
- Previously entered email address
- User profile information
- Search history

**How to Pass:**
```html
<!-- Use autocomplete attributes -->
<input type="text" name="name" autocomplete="name">
<input type="email" name="email" autocomplete="email">
<input type="tel" name="phone" autocomplete="tel">

<!-- Provide "Same as shipping" option -->
<label>
  <input type="checkbox" id="sameAsShipping">
  Billing address same as shipping
</label>

<!-- Remember previous selections -->
<select name="country" autocomplete="country">
  <option value="US" selected>United States</option>
</select>

<!-- Browser password autofill -->
<input type="password" autocomplete="current-password">
```

**Exceptions:**
- Re-entering password for security
- CAPTCHA or security codes
- Information that needs verification

**Implementation Example:**
```javascript
// Save form data to localStorage
function saveFormData(formData) {
  localStorage.setItem('formData', JSON.stringify(formData));
}

// Auto-populate from previous entry
function loadFormData() {
  const saved = localStorage.getItem('formData');
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById('email').value = data.email;
    // ... populate other fields
  }
}
```

---

#### 3.3.8 Accessible Authentication (Minimum) - NEW ✨
**Level:** AA
**Guideline:** 3.3 Input Assistance

**Requirement:**
A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step in an authentication process unless that step provides at least one of:
- **Alternative:** Another authentication method that doesn't rely on cognitive function test
- **Mechanism:** A mechanism to help complete the cognitive function test
- **Object Recognition:** The test is to recognize objects
- **Personal Content:** The test is to identify non-text content provided by the user

**What This Means:**
- Don't require users to remember complex passwords without help
- Provide alternatives like:
  - Password managers
  - Biometric authentication (Face ID, fingerprint)
  - Email/SMS magic links
  - Social login (OAuth)
  - Password reveal option

**How to Pass:**
```html
<!-- Password with show/hide toggle -->
<div class="password-field">
  <input type="password" id="password" autocomplete="current-password">
  <button type="button" aria-label="Show password" onclick="togglePassword()">
    👁️
  </button>
</div>

<!-- Support password managers -->
<input
  type="password"
  autocomplete="current-password"
  name="password"
>

<!-- Alternative authentication methods -->
<button type="button">Sign in with Google</button>
<button type="button">Sign in with Email Link</button>
<button type="button">Sign in with Face ID</button>

<!-- Copy-paste allowed -->
<input type="password" autocomplete="current-password"
       onpaste="return true">
```

**What's NOT Allowed (unless alternatives provided):**
- ❌ Complex CAPTCHA puzzles without audio alternative
- ❌ Memorizing random characters
- ❌ Disabling password paste
- ❌ Requiring manual transcription of codes

**What IS Allowed:**
- ✅ Biometric authentication
- ✅ Hardware security keys
- ✅ Password managers with autofill
- ✅ OAuth/Social login
- ✅ Magic links via email
- ✅ SMS codes (with paste support)
- ✅ Object recognition (pick the cat images)

**Testing:**
- Try using password manager
- Verify paste works in password fields
- Check for show/hide password option
- Test alternative authentication methods

---

#### 3.3.9 Accessible Authentication (Enhanced) - NEW ✨
**Level:** AAA
**Guideline:** 3.3 Input Assistance

**Requirement:**
A cognitive function test is not required for any step in an authentication process unless that step provides at least one of:
- **Alternative:** Another authentication method that doesn't rely on cognitive function test
- **Mechanism:** A mechanism to help complete the cognitive function test

**What This Means:**
- Even stricter than 3.3.8
- Removes object recognition and personal content exceptions
- Essentially requires passwordless or highly assisted authentication

**How to Pass:**
- Use biometric authentication (fingerprint, face recognition)
- Implement magic link authentication
- Use hardware security keys
- Support OAuth/social login
- Allow password managers with full autocomplete

**Best Practices:**
```html
<!-- Passwordless authentication -->
<form id="magic-link-auth">
  <label for="email">Email Address</label>
  <input type="email" id="email" autocomplete="email" required>
  <button type="submit">Send Login Link</button>
</form>

<!-- Biometric option -->
<button onclick="authenticateWithBiometric()">
  Sign in with Face ID
</button>

<!-- Hardware key support -->
<button onclick="authenticateWithWebAuthn()">
  Sign in with Security Key
</button>
```

---

## WCAG 2.2 Level AA Compliance Summary

To meet WCAG 2.2 Level AA, you must meet all criteria from:
- ✅ All WCAG 2.0 Level A and AA (25 + 13 = 38 criteria)
- ✅ All WCAG 2.1 Level A and AA additions (5 + 7 = 12 criteria)
- ✅ All WCAG 2.2 Level A and AA additions (1 + 4 = 5 criteria)

**Total: 55 success criteria** for WCAG 2.2 Level AA

### New in WCAG 2.2 AA (5 criteria):
1. ✅ **2.4.11** Focus Not Obscured (Minimum)
2. ✅ **2.5.7** Dragging Movements
3. ✅ **2.5.8** Target Size (Minimum)
4. ✅ **3.3.7** Redundant Entry
5. ✅ **3.3.8** Accessible Authentication (Minimum)

---

## Quick Checklist: WCAG 2.2 AA New Requirements

### Focus Visibility
- [ ] Focused elements are not entirely hidden by sticky headers/footers
- [ ] Focused elements remain visible when scrolling
- [ ] Modal dialogs don't cover focused elements

### Touch Targets
- [ ] Interactive elements are at least 24x24 CSS pixels
- [ ] OR have 24px spacing around them
- [ ] Mobile-friendly tap targets throughout

### Dragging Alternatives
- [ ] All drag-and-drop has button/keyboard alternative
- [ ] Sliders have text input alternative
- [ ] File uploads have browse button

### Forms & Data Entry
- [ ] Previously entered info is auto-populated or selectable
- [ ] Autocomplete attributes used on all applicable inputs
- [ ] Users don't re-enter same information multiple times

### Authentication
- [ ] Password fields allow paste
- [ ] Show/hide password option provided
- [ ] Support for password managers (autocomplete attributes)
- [ ] Alternative authentication methods available (biometric, magic link, OAuth)
- [ ] No complex CAPTCHAs without alternatives

---

## Implementation Priority

### High Priority (Most Impact)
1. **Target Size (2.5.8)** - Affects all users, especially mobile
2. **Redundant Entry (3.3.7)** - Improves form usability significantly
3. **Accessible Authentication (3.3.8)** - Critical for login flows

### Medium Priority
4. **Focus Not Obscured (2.4.11)** - Helps keyboard users
5. **Dragging Movements (2.5.7)** - Improves accessibility of interactive features

### Lower Priority (AAA)
6. **Focus Not Obscured Enhanced (2.4.12)** - AAA level
7. **Focus Appearance (2.4.13)** - AAA level
8. **Accessible Authentication Enhanced (3.3.9)** - AAA level

---

## Testing Tools for WCAG 2.2

### Automated Testing
- **axe DevTools** - Updated for WCAG 2.2
- **WAVE** - Includes WCAG 2.2 checks
- **Lighthouse** - Google's accessibility scanner
- **Pa11y** - Command-line testing

### Manual Testing
- **Focus testing:** Tab through entire site, verify visibility
- **Touch target testing:** Use DevTools device mode, measure elements
- **Form testing:** Complete multi-step forms, verify no redundant entry
- **Authentication testing:** Test login with password manager and alternatives

### Browser Extensions
- **Accessibility Insights** - Microsoft's WCAG 2.2 testing tool
- **axe DevTools** - Deque's comprehensive scanner
- **WAVE** - WebAIM's evaluation tool

---

## WCAG 2.2 vs 2.1 vs 2.0

| Version | Success Criteria | Release Date | Status |
|---------|-----------------|--------------|--------|
| WCAG 2.0 | 61 criteria (38 for AA) | Dec 2008 | Superseded |
| WCAG 2.1 | 78 criteria (50 for AA) | Jun 2018 | Superseded |
| WCAG 2.2 | 86 criteria (55 for AA) | Oct 2023 | Current |

**Backward Compatibility:**
- WCAG 2.2 includes all 2.1 criteria
- WCAG 2.1 includes all 2.0 criteria
- Meeting 2.2 AA = Meeting 2.1 AA + 5 new criteria

---

## Additional Resources

### Official Documentation
- [WCAG 2.2 Official Standard](https://www.w3.org/TR/WCAG22/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)

### What's New
- [What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [WCAG 2.2 Changes](https://www.w3.org/WAI/WCAG22/changes/)

### Testing & Tools
- [WebAIM Articles](https://webaim.org/articles/)
- [Deque University](https://dequeuniversity.com/)
- [A11y Project](https://www.a11yproject.com/)

---

## Implementation Examples

### Complete Form with WCAG 2.2 Compliance
```html
<form method="post" action="/submit">
  <!-- 3.3.7 Redundant Entry: Autocomplete -->
  <label for="name">Full Name</label>
  <input
    type="text"
    id="name"
    name="name"
    autocomplete="name"
    required
  >

  <label for="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    autocomplete="email"
    required
  >

  <!-- 3.3.8 Accessible Authentication: Show password -->
  <label for="password">Password</label>
  <div class="password-wrapper">
    <input
      type="password"
      id="password"
      autocomplete="current-password"
      required
    >
    <button
      type="button"
      aria-label="Show password"
      onclick="togglePassword()"
      style="min-width: 44px; min-height: 44px;"
      <!-- 2.5.8 Target Size -->
    >
      👁️
    </button>
  </div>

  <!-- 2.5.7 Dragging: File upload with button -->
  <label>Upload Document</label>
  <div class="file-upload-area">
    <div class="drop-zone">Drag file here</div>
    <button
      type="button"
      style="min-width: 44px; min-height: 44px;"
      onclick="document.getElementById('fileInput').click()"
    >
      Browse Files
    </button>
    <input type="file" id="fileInput" hidden>
  </div>

  <!-- 2.5.8 Target Size: Large submit button -->
  <button
    type="submit"
    style="min-width: 120px; min-height: 44px; padding: 12px 24px;"
  >
    Submit Form
  </button>
</form>

<style>
/* 2.4.11 Focus Not Obscured */
html {
  scroll-padding-top: 80px; /* Account for sticky header */
}

/* 2.4.13 Focus Appearance (AAA) */
:focus {
  outline: 3px solid #E57200; /* UVA Orange */
  outline-offset: 2px;
}

/* Ensure focus is not obscured by sticky elements */
.sticky-header {
  position: fixed;
  top: 0;
  z-index: 100;
}

:focus {
  position: relative;
  z-index: 101; /* Above sticky header */
}
</style>
```

---

**Last Updated:** October 2023
**Next Review:** WCAG 2.3 (Expected 2025-2026)
