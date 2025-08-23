#!/usr/bin/env node

/**
 * Basic accessibility guidelines check for Allen Consultancy website
 * This script validates common accessibility patterns in the codebase
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const srcDir = "src";
const issues = [];
let filesChecked = 0;

// Color contrast ratios (simplified check)
const colorContrasts = {
  "#ffffff": { bg: true, name: "white" },
  "#000000": { bg: true, name: "black" },
  "#1d4ed8": { text: true, name: "primary blue" },
  "#1e40af": { text: true, name: "primary blue dark" },
  "#374151": { text: true, name: "gray-700" },
  "#6b7280": { text: true, name: "gray-500" },
  "#111827": { text: true, name: "gray-900" },
};

function checkFile(filePath) {
  if (extname(filePath) !== ".astro") return;

  filesChecked++;
  const content = readFileSync(filePath, "utf-8");
  const fileName = filePath.replace(srcDir + "/", "");

  // Check for missing alt attributes on images
  const imgTags = content.match(/<img[^>]*>/g) || [];
  imgTags.forEach((img, index) => {
    if (!img.includes("alt=")) {
      issues.push({
        file: fileName,
        type: "Missing alt attribute",
        line: `Image ${index + 1}`,
        severity: "error",
      });
    } else if (img.includes('alt=""') && !img.includes('aria-hidden="true"')) {
      issues.push({
        file: fileName,
        type: "Empty alt attribute without aria-hidden",
        line: `Image ${index + 1}`,
        severity: "warning",
      });
    }
  });

  // Check for proper heading hierarchy
  const headings = content.match(/<h[1-6][^>]*>/g) || [];
  let lastHeadingLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.match(/h([1-6])/)[1]);
    if (level > lastHeadingLevel + 1) {
      issues.push({
        file: fileName,
        type: "Heading hierarchy skip",
        line: `Heading ${index + 1} (h${level} after h${lastHeadingLevel})`,
        severity: "warning",
      });
    }
    lastHeadingLevel = level;
  });

  // Check for form inputs without labels
  const inputs = content.match(/<input[^>]*>/g) || [];
  inputs.forEach((input, index) => {
    if (!input.includes("aria-label=") && !input.includes("aria-labelledby=")) {
      const hasId = input.match(/id="([^"]*)"/) || input.match(/id='([^']*)'/);
      if (!hasId || !content.includes(`for="${hasId[1]}"`)) {
        issues.push({
          file: fileName,
          type: "Input without proper label",
          line: `Input ${index + 1}`,
          severity: "error",
        });
      }
    }
  });

  // Check for buttons without accessible text
  const buttons = content.match(/<button[^>]*>.*?<\/button>/gs) || [];
  buttons.forEach((button, index) => {
    const hasText = button.replace(/<[^>]*>/g, "").trim();
    const hasAriaLabel = button.includes("aria-label=");
    const hasAriaLabelledby = button.includes("aria-labelledby=");

    if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
      issues.push({
        file: fileName,
        type: "Button without accessible text",
        line: `Button ${index + 1}`,
        severity: "error",
      });
    }
  });

  // Check for links without accessible text
  const links = content.match(/<a[^>]*>.*?<\/a>/gs) || [];
  links.forEach((link, index) => {
    const hasText = link.replace(/<[^>]*>/g, "").trim();
    const hasAriaLabel = link.includes("aria-label=");

    if (!hasText && !hasAriaLabel) {
      issues.push({
        file: fileName,
        type: "Link without accessible text",
        line: `Link ${index + 1}`,
        severity: "error",
      });
    }
  });

  // Check for proper ARIA roles
  const roleElements = content.match(/role="[^"]*"/g) || [];
  const validRoles = [
    "banner",
    "navigation",
    "main",
    "contentinfo",
    "region",
    "button",
    "link",
    "heading",
  ];
  roleElements.forEach((roleAttr) => {
    const role = roleAttr.match(/role="([^"]*)"/)[1];
    if (!validRoles.includes(role)) {
      issues.push({
        file: fileName,
        type: "Invalid ARIA role",
        line: `Role: ${role}`,
        severity: "warning",
      });
    }
  });
}

function walkDirectory(dir) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else {
      checkFile(filePath);
    }
  });
}

console.log("🔍 Running accessibility guidelines check...\n");

walkDirectory(srcDir);

console.log(`📊 Checked ${filesChecked} Astro files\n`);

if (issues.length === 0) {
  console.log("✅ No accessibility issues found!");
  console.log("\n📋 Accessibility checklist:");
  console.log("  ✓ All images have alt attributes");
  console.log("  ✓ Proper heading hierarchy");
  console.log("  ✓ Form inputs have labels");
  console.log("  ✓ Buttons have accessible text");
  console.log("  ✓ Links have accessible text");
  console.log("  ✓ Valid ARIA roles used");
} else {
  console.log(`⚠️  Found ${issues.length} accessibility issues:\n`);

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  if (errors.length > 0) {
    console.log("🚨 ERRORS (must fix):");
    errors.forEach((issue) => {
      console.log(`  ${issue.file}: ${issue.type} - ${issue.line}`);
    });
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS (should fix):");
    warnings.forEach((issue) => {
      console.log(`  ${issue.file}: ${issue.type} - ${issue.line}`);
    });
    console.log("");
  }

  console.log("💡 Next steps:");
  console.log("  1. Fix the errors listed above");
  console.log('  2. Run "npm run dev" and test with screen reader');
  console.log('  3. Run "npm run a11y:lighthouse" for detailed audit');
  console.log("  4. Test keyboard navigation manually");
}

console.log("\n🎯 Manual testing checklist:");
console.log("  □ Test keyboard navigation (Tab, Enter, Space, Arrow keys)");
console.log("  □ Test with screen reader (VoiceOver on Mac, NVDA on Windows)");
console.log("  □ Verify color contrast ratios (4.5:1 minimum)");
console.log("  □ Test responsive design on mobile devices");
console.log("  □ Verify focus indicators are visible");

process.exit(issues.filter((i) => i.severity === "error").length > 0 ? 1 : 0);
