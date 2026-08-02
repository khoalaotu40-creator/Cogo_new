import re

with open('server/api/vehicles.ts', 'r') as f:
    content = f.read()

old_catch = """  } catch (err) {
    console.error('Register vehicle error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to register vehicle' });
  }"""

new_catch = """  } catch (err: any) {
    console.error('Register vehicle error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to register vehicle', details: err.message || String(err) });
  }"""

content = content.replace(old_catch, new_catch)

with open('server/api/vehicles.ts', 'w') as f:
    f.write(content)
