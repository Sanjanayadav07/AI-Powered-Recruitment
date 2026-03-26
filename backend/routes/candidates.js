router.get("/candidates", async (req, res) => {
  const users = await User.find();

  const ranked = users.map((u) => {
    let score = 0;

    if (u.profile?.skills) score += u.profile.skills.split(",").length * 10;
    if (u.profile?.about) score += 20;

    return { ...u._doc, score };
  });

  ranked.sort((a, b) => b.score - a.score);

  res.json(ranked);
});