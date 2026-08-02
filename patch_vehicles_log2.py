import re

with open('server/api/vehicles.ts', 'r') as f:
    content = f.read()

old_update = """  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update location' });
  }"""

new_update = """  } catch (err: any) {
    console.error('Update location error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to update location', details: err.message || String(err) });
  }"""

old_get = """  } catch (err) {
    console.error('Get vehicles error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch vehicles' });
  }"""

new_get = """  } catch (err: any) {
    console.error('Get vehicles error:', err.message || err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch vehicles', details: err.message || String(err) });
  }"""

content = content.replace(old_update, new_update).replace(old_get, new_get)

with open('server/api/vehicles.ts', 'w') as f:
    f.write(content)
