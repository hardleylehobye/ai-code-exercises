/**
 * Validates user input data for registration and profile updates.
 * Returns an array of validation errors. Decomposed into domain-specific helpers.
 */

function validateUserData(userData, options = {}) {
  const errors = [];
  const isRegistration = options.isRegistration || false;

  checkRequiredFields(userData, isRegistration, errors);
  if (isRegistration) {
    validateUsername(userData.username, options.checkExisting, errors);
    validatePassword(userData.password, userData.confirmPassword, errors);
  }
  validateEmail(userData.email, isRegistration, options.checkExisting, errors);
  validateDateOfBirth(userData.dateOfBirth, errors);
  validateAddress(userData.address, errors);
  validatePhone(userData.phone, errors);
  runCustomValidations(userData, options.customValidations, errors);

  return errors;
}

// --- Required fields ---
const REQUIRED_REGISTRATION = ['username', 'email', 'password', 'confirmPassword'];
const REQUIRED_PROFILE = ['firstName', 'lastName', 'dateOfBirth', 'address'];

function checkRequiredFields(userData, isRegistration, errors) {
  const fields = isRegistration ? REQUIRED_REGISTRATION : REQUIRED_PROFILE;
  for (const field of fields) {
    const value = userData[field];
    if (value === undefined) {
      if (isRegistration) errors.push(`${field} is required for registration`);
      continue;
    }
    const str = typeof value === 'string' ? value.trim() : String(value);
    if (str === '') {
      if (isRegistration) {
        errors.push(`${field} is required for registration`);
      } else {
        errors.push(`${field} cannot be empty if provided`);
      }
    }
  }
}

// --- Username ---
function validateUsername(username, checkExisting, errors) {
  if (!username || typeof username !== 'string') return;
  const s = username.trim();
  if (s.length < 3) {
    errors.push('Username must be at least 3 characters long');
    return;
  }
  if (s.length > 20) {
    errors.push('Username must be at most 20 characters long');
    return;
  }
  if (!/^[a-zA-Z0-9_]+$/.test(s)) {
    errors.push('Username can only contain letters, numbers, and underscores');
    return;
  }
  if (checkExisting && checkExisting.usernameExists(s)) {
    errors.push('Username is already taken');
  }
}

// --- Password ---
function validatePassword(password, confirmPassword, errors) {
  if (!password || typeof password !== 'string') return;
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
    return;
  }
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character');
  if (confirmPassword !== password) {
    errors.push('Password and confirmation do not match');
  }
}

// --- Email ---
function validateEmail(email, isRegistration, checkExisting, errors) {
  if (email === undefined) return;
  const str = typeof email === 'string' ? email.trim() : String(email);
  if (str === '') {
    if (isRegistration) errors.push('Email is required');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(str)) {
    errors.push('Email format is invalid');
    return;
  }
  if (checkExisting && checkExisting.emailExists(str)) {
    errors.push('Email is already registered');
  }
}

// --- Date of birth ---
function validateDateOfBirth(dateOfBirth, errors) {
  if (dateOfBirth === undefined || dateOfBirth === '') return;
  const dobDate = new Date(dateOfBirth);
  if (isNaN(dobDate.getTime())) {
    errors.push('Date of birth is not a valid date');
    return;
  }
  const now = new Date();
  const minAgeDate = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());
  const maxAgeDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
  if (dobDate > now) errors.push('Date of birth cannot be in the future');
  else if (dobDate > minAgeDate) errors.push('You must be at least 13 years old');
  else if (dobDate < maxAgeDate) errors.push('Invalid date of birth (age > 120 years)');
}

// --- Address ---
const ADDRESS_FIELDS = ['street', 'city', 'zip', 'country'];
const ZIP_PATTERNS = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
  UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/
};

function validateAddress(address, errors) {
  if (address === undefined || address === '') return;
  if (typeof address !== 'object') {
    errors.push('Address must be an object with required fields');
    return;
  }
  for (const field of ADDRESS_FIELDS) {
    const v = address[field];
    if (!v || (typeof v === 'string' && v.trim() === '')) {
      errors.push(`Address ${field} is required`);
    }
  }
  const zip = address.zip;
  const country = address.country;
  if (zip && country) {
    const zipStr = String(zip).trim();
    if (country === 'US' && !ZIP_PATTERNS.US.test(zipStr)) errors.push('Invalid US ZIP code format');
    else if (country === 'CA' && !ZIP_PATTERNS.CA.test(zipStr)) errors.push('Invalid Canadian postal code format');
    else if (country === 'UK' && !ZIP_PATTERNS.UK.test(zipStr)) errors.push('Invalid UK postal code format');
  }
}

// --- Phone ---
function validatePhone(phone, errors) {
  if (phone === undefined || phone === '') return;
  if (!/^\+?[\d\s\-()]{10,15}$/.test(String(phone).trim())) {
    errors.push('Phone number format is invalid');
  }
}

// --- Custom validations ---
function runCustomValidations(userData, customValidations, errors) {
  if (!customValidations || !Array.isArray(customValidations)) return;
  for (const validation of customValidations) {
    const field = validation.field;
    if (userData[field] === undefined) continue;
    const valid = validation.validator(userData[field], userData);
    if (!valid) {
      errors.push(validation.message || `Invalid value for ${field}`);
    }
  }
}

module.exports = {
  validateUserData,
  checkRequiredFields,
  validateUsername,
  validatePassword,
  validateEmail,
  validateDateOfBirth,
  validateAddress,
  validatePhone,
  runCustomValidations
};
