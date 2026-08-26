from playwright.sync_api import sync_playwright
import sys

URL = "http://localhost:5173"
results = []

def log(test, passed, detail=""):
    status = "PASS" if passed else "FAIL"
    results.append((test, passed))
    print(f"  [{status}] {test}" + (f" -- {detail}" if detail else ""))

def close_modal(page):
    page.keyboard.press("Escape")
    page.wait_for_timeout(500)
    # Try z-60 overlays first, then z-50
    for z in ["z-\\[60\\]", "z-50"]:
        overlay = page.locator(f'.fixed.inset-0.{z}')
        if overlay.count() > 0:
            # Click the overlay background (not inside the card)
            overlay.first.click(position={"x": 10, "y": 10})
            page.wait_for_timeout(500)
            break
    page.wait_for_timeout(300)

def activate_admin(page):
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    eye = page.locator('button[title="تحرير الصور"], button[title="Edit Images"]')
    eye.wait_for(state="visible", timeout=5000)
    for _ in range(5):
        eye.click()
    page.wait_for_timeout(500)

def enter_password(page, pw="1516"):
    pwd_input = page.locator('input[type="password"]')
    pwd_input.wait_for(state="visible", timeout=5000)
    pwd_input.fill(pw)
    # Click submit inside the password modal (parent form)
    pwd_input.locator('..').locator('button[type="submit"]').click()
    page.wait_for_timeout(500)

def deactivate_admin(page):
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    lock = page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]')
    lock.wait_for(state="visible", timeout=5000)
    for _ in range(5):
        lock.click()
    page.wait_for_timeout(500)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    print("\n=== ADMIN MODE PERMISSION VERIFICATION ===\n")

    # ── TEST 1: Initial state — no admin UI ──
    print("[1] Initial State (Admin OFF)")
    page.goto(URL)
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(3000)  # wait for React hydration + Base44 SDK

    log("Eye icon visible",
        page.locator('button[title="تحرير الصور"], button[title="Edit Images"]').is_visible())

    log("Lock/exit button hidden",
        page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]').count() == 0)

    log("Delete buttons hidden (0)",
        page.locator('button[title*="Delete"], button[title*="حذف"]').count() == 0)

    log("Edit image buttons hidden (0)",
        page.locator('button[title*="تعديل الصور"], button[title*="Edit Images"]').count() == 0)

    log("New Project button hidden",
        not page.locator('button:has-text("مشروع جديد"), button:has-text("New Project")').is_visible())

    log("Edit Texts button hidden",
        not page.locator('button:has-text("تعديل النصوص"), button:has-text("Edit Texts")').is_visible())

    log("Edit Design button hidden",
        not page.locator('button:has-text("تعديل التصميم"), button:has-text("Edit Design")').is_visible())

    # ── TEST 2: 5-tap shows password prompt, wrong password fails, correct works ──
    print("\n[2] Password Prompt (5-tap)")
    activate_admin(page)

    log("Password prompt appears",
        page.locator('input[type="password"]').is_visible())

    # Wrong password
    page.locator('input[type="password"]').fill("0000")
    page.locator('input[type="password"]').locator('..').locator('button[type="submit"]').click()
    page.wait_for_timeout(500)
    log("Wrong password shows error",
        page.locator('.text-destructive:has-text("Incorrect password"), .text-destructive:has-text("غير صحيحة")').is_visible())

    # Correct password
    page.locator('input[type="password"]').fill("1516")
    page.locator('input[type="password"]').locator('..').locator('button[type="submit"]').click()
    page.wait_for_timeout(500)

    log("Lock/exit button visible after correct password",
        page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]').is_visible())

    log("Delete buttons visible",
        page.locator('button[title*="Delete"], button[title*="حذف"]').count() >= 3)

    log("New Project button visible",
        page.locator('button:has-text("مشروع جديد"), button:has-text("New Project")').is_visible())

    # ── TEST 3: Timeout resets counter ──
    print("\n[3] Timeout Reset (3 taps then wait then 2 taps)")
    deactivate_admin(page)
    eye = page.locator('button[title="تحرير الصور"], button[title="Edit Images"]')
    eye.wait_for(state="visible", timeout=3000)
    for _ in range(3):
        eye.click()
    page.wait_for_timeout(4000)  # wait for 3s timeout to expire
    for _ in range(2):
        eye.click()
    page.wait_for_timeout(300)

    log("Admin NOT activated after timeout",
        page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]').count() == 0)

    # ── TEST 4: Project card click ──
    print("\n[4] Project Card Interaction")
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    cards = page.locator('#portfolio .diamond-frame')
    log("Project cards rendered",
        cards.count() > 0, f"count={cards.count()}")

    # Click card in non-admin mode -> should open lightbox
    cards.first.click()
    page.wait_for_timeout(1500)
    # Lightbox uses fixed overlay
    lightbox = page.locator('.fixed.inset-0').last
    log("Lightbox opens on card click (admin OFF)",
        lightbox.is_visible())
    # Close lightbox
    close_modal(page)

    # ── TEST 5: Admin ON — card click does NOT open lightbox ──
    print("\n[5] Card Click Blocked in Admin Mode")
    activate_admin(page)
    enter_password(page)
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    cards.first.click()
    page.wait_for_timeout(1000)
    # Check if any new overlay appeared (lightbox)
    overlays = page.locator('.fixed.inset-0')
    log("Lightbox NOT opened in admin mode",
        overlays.count() <= 1)  # only header counts as 1

    # ── TEST 6: Create Project Modal ──
    print("\n[6] Create Project Modal")
    page.locator('button:has-text("مشروع جديد"), button:has-text("New Project")').click()
    page.wait_for_timeout(1000)
    modal = page.locator('.fixed.inset-0.z-\\[60\\]')
    log("Create modal opens",
        modal.count() > 0)
    name_input = page.locator('input[placeholder*="اسم المشروع"], input[placeholder*="Project name"]')
    log("Name input present",
        name_input.count() > 0)
    category_select = page.locator('select')
    log("Category select present",
        category_select.count() > 0)
    # Close
    close_modal(page)

    # ── TEST 7: Edit Texts Modal ──
    print("\n[7] Edit Texts Modal (ContentEditorModal)")
    page.locator('button:has-text("تعديل النصوص"), button:has-text("Edit Texts")').click()
    page.wait_for_timeout(1500)
    search_input = page.locator('input[placeholder*="بحث"], input[placeholder*="Search"]')
    log("Search input present",
        search_input.count() > 0)
    textareas = page.locator('.fixed.inset-0 textarea, .fixed.inset-0 input[type="text"]')
    log("Editable text fields present",
        textareas.count() > 0, f"count={textareas.count()}")
    close_modal(page)

    # ── TEST 8: Edit Design Modal ──
    print("\n[8] Edit Design Modal (StyleEditorModal)")
    page.locator('button:has-text("تعديل التصميم"), button:has-text("Edit Design")').click()
    page.wait_for_timeout(1000)
    colors_heading = page.locator('h4:has-text("الألوان"), h4:has-text("Colors")')
    log("Colors section present",
        colors_heading.count() > 0)
    sizes_heading = page.locator('h4:has-text("الأحجام"), h4:has-text("Sizes")')
    log("Sizes section present",
        sizes_heading.count() > 0)
    save_btn = page.locator('button:has-text("حفظ التصميم"), button:has-text("Save Design")')
    log("Save Design button present",
        save_btn.count() > 0)
    reset_btn = page.locator('button:has-text("استعادة الافتراضي"), button:has-text("Reset")')
    log("Reset button present",
        reset_btn.count() > 0)
    close_modal(page)

    # ── TEST 9: Edit Project Images button ──
    print("\n[9] Edit Project Images (Pencil button)")
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    pencil = page.locator('button[title="تعديل الصور"], button[title="Edit Images"]').first
    pencil.click()
    page.wait_for_timeout(1000)
    img_editor = page.locator('.fixed.inset-0')
    log("Image editor opens",
        img_editor.count() > 0)
    close_modal(page)

    # ── TEST 10: Delete confirmation ──
    print("\n[10] Delete Project Confirmation")
    lock_check = page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]')
    if lock_check.count() > 0:
        deactivate_admin(page)
    activate_admin(page)
    enter_password(page)
    page.locator('#portfolio').scroll_into_view_if_needed()
    page.wait_for_timeout(300)
    delete_btn = page.locator('button[title="حذف المشروع"], button[title="Delete Project"]').first
    # Use dialog handler to auto-dismiss confirm
    page.on("dialog", lambda d: (log("Confirm dialog appeared", True), d.dismiss()))
    delete_btn.click()
    page.wait_for_timeout(1000)

    # ── TEST 11: Toggle OFF, all admin UI disappears ──
    print("\n[11] Deactivate Admin (all permissions revoked)")
    lock_check = page.locator('button[title="إنهاء التحرير"], button[title="Exit Edit"]')
    if lock_check.count() > 0:
        deactivate_admin(page)

    log("Delete buttons hidden",
        page.locator('button[title*="Delete"], button[title*="حذف"]').count() == 0)

    log("New Project hidden",
        not page.locator('button:has-text("مشروع جديد"), button:has-text("New Project")').is_visible())

    log("Edit Texts hidden",
        not page.locator('button:has-text("تعديل النصوص"), button:has-text("Edit Texts")').is_visible())

    log("Edit Design hidden",
        not page.locator('button:has-text("تعديل التصميم"), button:has-text("Edit Design")').is_visible())

    log("Eye icon restored",
        page.locator('button[title="تحرير الصور"], button[title="Edit Images"]').is_visible())

    # ── SUMMARY ──
    print("\n" + "=" * 50)
    passed = sum(1 for _, v in results if v)
    failed = sum(1 for _, v in results if not v)
    total = len(results)
    print(f"\n  RESULTS: {passed}/{total} passed, {failed} failed\n")

    if failed > 0:
        print("  FAILED TESTS:")
        for name, ok in results:
            if not ok:
                print(f"    - {name}")

    browser.close()
    sys.exit(0 if failed == 0 else 1)
