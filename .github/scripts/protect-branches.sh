#!/usr/bin/env bash
# Restrict merges/pushes on dev and main to the repository owner.
# Requires: gh CLI, admin access, and GitHub Team/Pro (private repos on free plan cannot use branch protection).

set -euo pipefail

OWNER_LOGIN="${OWNER_LOGIN:-michael-timi}"
REPO="${REPO:-convmerc/covmerc_web}"

protect_branch() {
  local branch="$1"
  echo "Protecting ${REPO}:${branch} (push/merge restricted to @${OWNER_LOGIN})..."

  gh api \
    --method PUT \
    -H "Accept: application/vnd.github+json" \
    "repos/${REPO}/branches/${branch}/protection" \
    --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["CI / Lint and build"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": {
    "users": ["${OWNER_LOGIN}"],
    "teams": [],
    "apps": []
  },
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
}

for branch in dev main; do
  protect_branch "${branch}"
done

echo "Done. dev and main are protected; only @${OWNER_LOGIN} can push/merge."
