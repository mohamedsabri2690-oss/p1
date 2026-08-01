// attachments listing for tickets
router.get('/tickets/:id/attachments', async (req, res) => {
  try {
    const r = await db.query('SELECT id, file_path, created_at FROM ticket_attachments WHERE ticket_id = $1 ORDER BY id DESC', [req.params.id]);
    res.json({ data: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});
