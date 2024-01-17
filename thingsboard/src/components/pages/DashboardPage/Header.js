import { useState } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useGeoJSON } from '~/hooks';

function Header({ isEditMode, setIsEditMode, onSave }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--tb-login-primary-900)',
        display: 'flex',
        flexDirection: 'row',
        padding: '16px 8px',
        justifyContent: 'space-evenly',
      }}
    >
      <span style={{ color: 'white', fontWeight: '600', fontSize: '1.8rem', marginLeft: '32px' }}>Trip animation</span>
      <div className="ms-auto">
        {!isEditMode ? (
          <Button variant="danger" style={{ fontSize: '1.4rem' }} onClick={() => setIsEditMode(true)}>
            <i class="bi bi-pencil-fill"></i>
            <span style={{ marginLeft: '6px' }}>Edit Geofence</span>
          </Button>
        ) : (
          <Stack gap={3} direction="horizontal">
            <Button variant="secondary" onClick={() => setIsEditMode(false)} style={{ fontSize: '1.4rem' }}>
              <i class="bi bi-x-lg"></i>
              <span style={{ marginLeft: '6px' }}>Cancel</span>
            </Button>
            <Button
              variant="success"
              style={{ fontSize: '1.4rem' }}
              onClick={(e) => {
                onSave();
                setIsEditMode(false);
              }}
            >
              <i class="bi bi-floppy-fill"></i>
              <span style={{ marginLeft: '6px' }}>Save</span>
            </Button>
          </Stack>
        )}
      </div>
    </div>
  );
}

export default Header;
