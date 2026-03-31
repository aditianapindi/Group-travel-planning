/**
 * Creates the "Group Travel Planning — Quick Survey" Google Form.
 *
 * HOW TO RUN:
 * 1. Go to https://script.google.com
 * 2. Click "New project"
 * 3. Delete any code in the editor
 * 4. Paste this entire script
 * 5. Click the "Run" button (or Run > Run function > createSurveyForm)
 * 6. Grant permissions when prompted (it needs access to create Forms)
 * 7. Check the Execution log for the form URL — open it to verify
 */

function createSurveyForm() {
  var form = FormApp.create("Group Travel Planning — Quick Survey");
  form.setDescription(
    "Help us understand how groups plan trips together. 9 questions, ~2 minutes."
  );
  form.setIsQuiz(false);

  // ── SECTION 1: About You ──

  form.addPageBreakItem().setTitle("About You");

  // Q1
  form
    .addMultipleChoiceItem()
    .setTitle("Where do you live?")
    .setChoiceValues(["US", "India", "Australia", "UK", "Other"])
    .setRequired(true);

  // Q2
  form
    .addMultipleChoiceItem()
    .setTitle(
      "How many group trips (3+ people) have you taken in the past 12 months?"
    )
    .setChoiceValues(["0", "1", "2", "3\u20135", "5+"])
    .setRequired(true);

  // Q3
  form
    .addMultipleChoiceItem()
    .setTitle(
      "On your most recent group trip, were you the organizer or a participant?"
    )
    .setChoiceValues(["Organizer", "Participant", "Shared equally"])
    .setRequired(true);

  // ── SECTION 2: The Problem ──

  form.addPageBreakItem().setTitle("The Problem");

  // Q4
  form
    .addMultipleChoiceItem()
    .setTitle(
      "What\u2019s the #1 frustration when planning a group trip? (Pick one)"
    )
    .setChoiceValues([
      "Budget disagreements",
      "Scheduling conflicts",
      "Too many options, no decisions",
      "One person does all the work",
      "People flake or go silent",
    ])
    .setRequired(true);

  // Q5
  form
    .addMultipleChoiceItem()
    .setTitle(
      "Have you ever decided NOT to plan a group trip because it seemed like too much work?"
    )
    .setChoiceValues(["Yes", "No"])
    .setRequired(true);

  // ── SECTION 3: Would You Use This? ──

  form.addPageBreakItem().setTitle("Would You Use This?");

  // Q6
  form
    .addMultipleChoiceItem()
    .setTitle(
      'If someone in your group said "use this app for our next trip" \u2014 would you download it?'
    )
    .setChoiceValues([
      "Yes, immediately",
      "Yes, if it looked useful",
      "Probably not",
      "No \u2014 WhatsApp is fine",
    ])
    .setRequired(true);

  // Q7
  form
    .addMultipleChoiceItem()
    .setTitle(
      "What would you pay per trip for a tool that handles voting, budgets, itinerary, and expenses?"
    )
    .setChoiceValues(["$0 (free only)", "$1\u20133", "$3\u20135", "$5+"])
    .setRequired(true);

  // Q8
  form
    .addMultipleChoiceItem()
    .setTitle("Which ONE feature would make you most likely to use it?")
    .setChoiceValues([
      "Automatic expense splitting (no more Splitwise hassle)",
      "Anonymous budget alignment before planning starts",
      "AI-generated itinerary from your group\u2019s preferences",
      "Voting on destinations/dates with a deadline",
      "Shared live itinerary everyone can see during the trip",
    ])
    .setRequired(true);

  // ── SECTION 4: Budget ──

  form.addPageBreakItem().setTitle("Budget");

  // Q9
  form
    .addMultipleChoiceItem()
    .setTitle(
      "Would you share your budget range anonymously before trip planning starts?"
    )
    .setChoiceValues(["Yes", "No", "Depends on the group"])
    .setRequired(true);

  // ── Confirmation message ──

  form.setConfirmationMessage(
    "Thank you! Your responses help us build a better way to plan group trips."
  );

  Logger.log("Form created: " + form.getEditUrl());
  Logger.log("Shareable link: " + form.getPublishedUrl());
}
