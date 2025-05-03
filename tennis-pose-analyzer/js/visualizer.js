/**
 * Pose Visualization Module
 */

// Keypoint connection definitions
const POSE_CONNECTIONS = [
    [NOSE, LEFT_EYE], [LEFT_EYE, LEFT_EAR], [NOSE, RIGHT_EYE], [RIGHT_EYE, RIGHT_EAR],
    [LEFT_SHOULDER, RIGHT_SHOULDER], [LEFT_SHOULDER, LEFT_ELBOW], [LEFT_ELBOW, LEFT_WRIST],
    [RIGHT_SHOULDER, RIGHT_ELBOW], [RIGHT_ELBOW, RIGHT_WRIST],
    [LEFT_SHOULDER, LEFT_HIP], [RIGHT_SHOULDER, RIGHT_HIP], [LEFT_HIP, RIGHT_HIP],
    [LEFT_HIP, LEFT_KNEE], [LEFT_KNEE, LEFT_ANKLE], [RIGHT_HIP, RIGHT_KNEE], [RIGHT_KNEE, RIGHT_ANKLE]
  ];

// Connections to highlight for each stroke type
const STROKE_HIGHLIGHT_CONNECTIONS = {
  'forehand': [
    [RIGHT_SHOULDER, RIGHT_ELBOW], [RIGHT_ELBOW, RIGHT_WRIST],
    [RIGHT_HIP, RIGHT_KNEE], [RIGHT_KNEE, RIGHT_ANKLE]
  ],
  'backhand': [
    [LEFT_SHOULDER, LEFT_ELBOW], [LEFT_ELBOW, LEFT_WRIST],
    [LEFT_HIP, LEFT_KNEE], [LEFT_KNEE, LEFT_ANKLE]
  ],
  'serve': [
    [RIGHT_SHOULDER, RIGHT_ELBOW], [RIGHT_ELBOW, RIGHT_WRIST],
    [LEFT_HIP, LEFT_KNEE], [LEFT_KNEE, LEFT_ANKLE],
    [RIGHT_HIP, RIGHT_KNEE], [RIGHT_KNEE, RIGHT_ANKLE]
  ],
  'volley': [
    [LEFT_SHOULDER, RIGHT_SHOULDER],
    [LEFT_SHOULDER, LEFT_ELBOW], [LEFT_ELBOW, LEFT_WRIST],
    [RIGHT_SHOULDER, RIGHT_ELBOW], [RIGHT_ELBOW, RIGHT_WRIST]
  ]
};
  
/**
 * Draw detected pose on canvas
 * @param {Object} pose - Detected pose object
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawPose(pose, ctx) {
  if (!pose || !pose.keypoints) return;
  
  // Get canvas dimensions
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Performance optimization: Rendering settings
  ctx.imageSmoothingEnabled = false;
  
  // Get current stroke type and camera position
  const selectedStroke = document.getElementById('stroke-type')?.value || 'forehand';
  const cameraPosition = pose.cameraPosition || 'rear-elevated';
  
  // Get visualization style based on actual camera position
  const style = getVisualizationStyleForCamera(cameraPosition);
  
  // Draw motion trajectory (movement visualization)
  drawMotionTrajectory(pose.keypoints, ctx, selectedStroke);
  
  // Optimized skeleton drawing: Draw all connections at once
  drawSkeleton(pose.keypoints, pose.id, ctx, style, selectedStroke);
  
  // Draw keypoints with confidence indicators
  drawKeypointsWithConfidence(pose.keypoints, ctx, style);
  
  // Selectively display important joint angles
  drawImportantAngles(pose.keypoints, ctx, cameraPosition, selectedStroke);
  
  // Display pose recognition confidence
  drawPoseConfidence(pose, ctx);
}

/**
 * Draw keypoints with visual confidence indicators
 * @param {Array} keypoints - Array of keypoints
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} style - Visualization style
 */
function drawKeypointsWithConfidence(keypoints, ctx, style) {
  // Pre-define important keypoints
  const importantKeypoints = [
    RIGHT_WRIST, LEFT_WRIST, 
    RIGHT_ELBOW, LEFT_ELBOW,
    RIGHT_SHOULDER, LEFT_SHOULDER,
    RIGHT_KNEE, LEFT_KNEE
  ];
  
  // Separate important and regular keypoints for rendering
  const primaryKeypoints = [];
  const secondaryKeypoints = [];
  
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint && keypoint.score > 0.1) { // Lower threshold to show more keypoints
      if (importantKeypoints.includes(i)) {
        primaryKeypoints.push({
          x: keypoint.x, 
          y: keypoint.y, 
          score: keypoint.score,
          index: i  // Add index
        });
      } else {
        secondaryKeypoints.push({
          x: keypoint.x, 
          y: keypoint.y, 
          score: keypoint.score
        });
      }
    }
  }
  
  // Draw regular keypoints (smaller size)
  if (secondaryKeypoints.length > 0) {
    ctx.fillStyle = style.secondaryKeypointColor;
    
    for (const point of secondaryKeypoints) {
      // Adjust radius based on confidence (lower confidence = smaller)
      const radius = style.smallKeypointRadius * Math.max(0.5, point.score);
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  
  // Draw important keypoints (larger size)
  for (const point of primaryKeypoints) {
    // Adjust opacity and radius based on confidence
    const alpha = Math.max(0.4, point.score);
    const radius = style.largeKeypointRadius * Math.max(0.7, point.score);
    
    // Color based on confidence (red for low, green for high)
    const color = getConfidenceColor(point.score);
    
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Keypoint labels (optional)
    if (point.score > 0.5 && window.showKeypointLabels) {
      drawKeypointLabel(ctx, point.x, point.y, getKeypointLabel(point.index));
    }
    
    ctx.globalAlpha = 1.0;
  }
}

/**
 * Get confidence color based on score
 * @param {number} score - Confidence score (0-1)
 * @returns {string} - RGBA color string
 */
function getConfidenceColor(score) {
  // Interpolate color based on score range
  if (score < 0.3) {
    // Low confidence: Red
    return 'rgba(255, 0, 0, 0.7)';
  } else if (score < 0.6) {
    // Medium confidence: Yellow
    return 'rgba(255, 255, 0, 0.8)';
  } else {
    // High confidence: Green
    return 'rgba(0, 255, 0, 0.9)';
  }
}

/**
 * Get keypoint label based on index
 * @param {number} index - Keypoint index
 * @returns {string} - Keypoint label
 */
function getKeypointLabel(index) {
  const labels = {
    [RIGHT_SHOULDER]: 'RS',
    [LEFT_SHOULDER]: 'LS',
    [RIGHT_ELBOW]: 'RE',
    [LEFT_ELBOW]: 'LE',
    [RIGHT_WRIST]: 'RW',
    [LEFT_WRIST]: 'LW',
    [RIGHT_HIP]: 'RH',
    [LEFT_HIP]: 'LH',
    [RIGHT_KNEE]: 'RK',
    [LEFT_KNEE]: 'LK',
    [RIGHT_ANKLE]: 'RA',
    [LEFT_ANKLE]: 'LA'
  };
  
  return labels[index] || `K${index}`;
}

/**
 * Draw keypoint label
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X-coordinate
 * @param {number} y - Y-coordinate
 * @param {string} label - Label text
 */
function drawKeypointLabel(ctx, x, y, label) {
  ctx.font = '12px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 10);
}

/**
 * Display pose recognition confidence
 * @param {Object} pose - Detected pose object
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawPoseConfidence(pose, ctx) {
  if (!pose || !pose.score) return;
  
  const canvas = ctx.canvas;
  const confidenceText = `Confidence: ${Math.round(pose.score * 100)}%`;
  
  ctx.font = '16px Arial';
  ctx.fillStyle = getConfidenceColor(pose.score);
  ctx.textAlign = 'left';
  ctx.fillText(confidenceText, 10, 30);
}

/**
 * Draw keypoints
 * @param {Array} keypoints - Array of keypoints
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} style - Visualization style
 */
function drawKeypoints(keypoints, ctx, style) {
  // Pre-define important keypoints
  const importantKeypoints = [
    RIGHT_WRIST, LEFT_WRIST, 
    RIGHT_ELBOW, LEFT_ELBOW,
    RIGHT_SHOULDER, LEFT_SHOULDER,
    RIGHT_KNEE, LEFT_KNEE
  ];
  
  // Separate important and regular keypoints for rendering
  const primaryKeypoints = [];
  const secondaryKeypoints = [];
  
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];
    if (keypoint && keypoint.score > CONFIDENCE_THRESHOLD) {
      if (importantKeypoints.includes(i)) {
        primaryKeypoints.push({x: keypoint.x, y: keypoint.y});
      } else {
        secondaryKeypoints.push({x: keypoint.x, y: keypoint.y});
      }
    }
  }
  
  // Draw regular keypoints (smaller size)
  if (secondaryKeypoints.length > 0) {
    ctx.fillStyle = style.secondaryKeypointColor;
    ctx.beginPath();
    
    for (const point of secondaryKeypoints) {
      ctx.moveTo(point.x, point.y);
      ctx.arc(point.x, point.y, style.smallKeypointRadius, 0, 2 * Math.PI);
    }
    
    ctx.fill();
  }
  
  // Draw important keypoints (larger size)
  if (primaryKeypoints.length > 0) {
    ctx.fillStyle = style.primaryKeypointColor;
    ctx.beginPath();
    
    for (const point of primaryKeypoints) {
      ctx.moveTo(point.x, point.y);
      ctx.arc(point.x, point.y, style.largeKeypointRadius, 0, 2 * Math.PI);
    }
    
    ctx.fill();
  }
}

/**
 * Draw skeleton
 * @param {Array} keypoints - Array of keypoints
 * @param {number} poseId - Pose ID
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} style - Visualization style
 * @param {string} selectedStroke - Selected stroke type
 */
function drawSkeleton(keypoints, poseId, ctx, style, selectedStroke) {
  // Draw all connections at once
  ctx.lineWidth = style.thinLineWidth;
  ctx.strokeStyle = style.secondaryLineColor;
  
  // Pre-allocate line coordinates
  let lines = [];
  
  for (let i = 0; i < POSE_CONNECTIONS.length; i++) {
    const connection = POSE_CONNECTIONS[i];
    const pointA = keypoints[connection[0]];
    const pointB = keypoints[connection[1]];
    
    if (pointA && pointB && pointA.score > CONFIDENCE_THRESHOLD && 
        pointB.score > CONFIDENCE_THRESHOLD) {
      lines.push({
        x1: pointA.x, y1: pointA.y,
        x2: pointB.x, y2: pointB.y
      });
    }
  }
  
  // Draw regular connections
  if (lines.length > 0) {
    ctx.beginPath();
    for (const line of lines) {
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
    }
    ctx.stroke();
  }
  
  // Highlight important connections for selected stroke type
  const highlightConnections = STROKE_HIGHLIGHT_CONNECTIONS[selectedStroke] || [];
  
  if (highlightConnections.length > 0) {
    ctx.lineWidth = style.boldLineWidth;
    ctx.strokeStyle = style.primaryLineColor;
    
    lines = [];
    
    for (let i = 0; i < highlightConnections.length; i++) {
      const connection = highlightConnections[i];
      const pointA = keypoints[connection[0]];
      const pointB = keypoints[connection[1]];
      
      if (pointA && pointB && pointA.score > CONFIDENCE_THRESHOLD && 
          pointB.score > CONFIDENCE_THRESHOLD) {
        lines.push({
          x1: pointA.x, y1: pointA.y,
          x2: pointB.x, y2: pointB.y
        });
      }
    }
    
    // Draw highlighted connections
    if (lines.length > 0) {
      ctx.beginPath();
      for (const line of lines) {
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
      }
      ctx.stroke();
    }
  }
}

/**
 * Display important joint angles
 * @param {Array} keypoints - Array of keypoints
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} cameraPosition - Camera position
 * @param {string} strokeType - Stroke type
 */
function drawImportantAngles(keypoints, ctx, cameraPosition = 'rear-elevated', strokeType = 'forehand') {
  // Get visualization style based on camera position
  const visualStyle = getVisualizationStyleForCamera(cameraPosition);
  
  ctx.fillStyle = visualStyle.textColor;
  ctx.font = visualStyle.textFont;
  
  // Display at least two angles
  let displayedAngles = 0;
  
  // Display angles based on camera position
  if (cameraPosition === 'rear-elevated') {
    // Rear-elevated view angles
    switch (strokeType) {
      case 'forehand':
        // Shoulder-elbow angle (takeback) - Lower threshold
        if ((keypoints[RIGHT_HIP] && keypoints[RIGHT_HIP].score > 0.1) && 
            (keypoints[RIGHT_SHOULDER] && keypoints[RIGHT_SHOULDER].score > 0.1) && 
            (keypoints[RIGHT_ELBOW] && keypoints[RIGHT_ELBOW].score > 0.1)) {
          
          // Validate keypoint coordinates
          const rightHip = {
            x: parseFloat(keypoints[RIGHT_HIP].x), 
            y: parseFloat(keypoints[RIGHT_HIP].y)
          };
          const rightShoulder = {
            x: parseFloat(keypoints[RIGHT_SHOULDER].x), 
            y: parseFloat(keypoints[RIGHT_SHOULDER].y)
          };
          const rightElbow = {
            x: parseFloat(keypoints[RIGHT_ELBOW].x), 
            y: parseFloat(keypoints[RIGHT_ELBOW].y)
          };
          
          // Check for valid numbers
          if (!isNaN(rightHip.x) && !isNaN(rightHip.y) && 
              !isNaN(rightShoulder.x) && !isNaN(rightShoulder.y) &&
              !isNaN(rightElbow.x) && !isNaN(rightElbow.y)) {
              
            const shoulderToElbowAngle = calculateAngle(
              rightHip,
              rightShoulder, 
              rightElbow
            );
            
            drawAngle(
              ctx, 
              rightHip, 
              rightShoulder, 
              rightElbow, 
              shoulderToElbowAngle !== null ? `${shoulderToElbowAngle}°` : 'Calculating...',
              'rgba(255, 220, 50, 0.9)',
              40,
              4
            );
            displayedAngles++;
          } else {
            console.log('Shoulder-elbow angle calculation failed: Invalid coordinates', {
              rightHip, rightShoulder, rightElbow
            });
          }
        }
        
        // Elbow-wrist angle
        if ((keypoints[RIGHT_SHOULDER] && keypoints[RIGHT_SHOULDER].score > 0.1) && 
            (keypoints[RIGHT_ELBOW] && keypoints[RIGHT_ELBOW].score > 0.1) && 
            (keypoints[RIGHT_WRIST] && keypoints[RIGHT_WRIST].score > 0.1)) {
          
          const elbowToWristAngle = calculateAngle(
            keypoints[RIGHT_SHOULDER],
            keypoints[RIGHT_ELBOW],
            keypoints[RIGHT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST], 
            elbowToWristAngle !== null ? `${elbowToWristAngle}°` : 'Calculating...',
            'rgba(50, 220, 255, 0.9)',
            35,
            3
          );
          displayedAngles++;
        }
        
        // Knee angle
        if (displayedAngles < 2 && 
            isValidKeypoint(keypoints[RIGHT_HIP]) && 
            isValidKeypoint(keypoints[RIGHT_KNEE]) && 
            isValidKeypoint(keypoints[RIGHT_ANKLE])) {
          
          const kneeAngle = calculateAngle(
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE], 
            `${Math.round(kneeAngle)}°`,
            visualStyle.tertiaryAngleColor
          );
        }
        break;
        
      case 'backhand':
        // Left shoulder-elbow angle
        if ((keypoints[LEFT_HIP] && keypoints[LEFT_HIP].score > 0.1) && 
            (keypoints[LEFT_SHOULDER] && keypoints[LEFT_SHOULDER].score > 0.1) && 
            (keypoints[LEFT_ELBOW] && keypoints[LEFT_ELBOW].score > 0.1)) {
          
          // Validate keypoint coordinates
          const leftHip = {
            x: parseFloat(keypoints[LEFT_HIP].x), 
            y: parseFloat(keypoints[LEFT_HIP].y)
          };
          const leftShoulder = {
            x: parseFloat(keypoints[LEFT_SHOULDER].x), 
            y: parseFloat(keypoints[LEFT_SHOULDER].y)
          };
          const leftElbow = {
            x: parseFloat(keypoints[LEFT_ELBOW].x), 
            y: parseFloat(keypoints[LEFT_ELBOW].y)
          };
          
          // Check for valid numbers
          if (!isNaN(leftHip.x) && !isNaN(leftHip.y) && 
              !isNaN(leftShoulder.x) && !isNaN(leftShoulder.y) &&
              !isNaN(leftElbow.x) && !isNaN(leftElbow.y)) {
              
            const shoulderToElbowAngle = calculateAngle(
              leftHip,
              leftShoulder, 
              leftElbow
            );
            
            drawAngle(
              ctx, 
              leftHip, 
              leftShoulder, 
              leftElbow, 
              shoulderToElbowAngle !== null ? `${shoulderToElbowAngle}°` : 'Calculating...',
              'rgba(255, 220, 50, 0.9)',
              40,
              4
            );
            displayedAngles++;
          } else {
            console.log('Left shoulder-elbow angle calculation failed: Invalid coordinates', {
              leftHip, leftShoulder, leftElbow
            });
          }
        }
        
        // Elbow-wrist angle
        if ((keypoints[LEFT_SHOULDER] && keypoints[LEFT_SHOULDER].score > 0.1) && 
            (keypoints[LEFT_ELBOW] && keypoints[LEFT_ELBOW].score > 0.1) && 
            (keypoints[LEFT_WRIST] && keypoints[LEFT_WRIST].score > 0.1)) {
          
          const elbowToWristAngle = calculateAngle(
            keypoints[LEFT_SHOULDER],
            keypoints[LEFT_ELBOW],
            keypoints[LEFT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[LEFT_SHOULDER], 
            keypoints[LEFT_ELBOW], 
            keypoints[LEFT_WRIST], 
            elbowToWristAngle !== null ? `${elbowToWristAngle}°` : 'Calculating...',
            'rgba(50, 220, 255, 0.9)',
            35,
            3
          );
          displayedAngles++;
        }
        
        // Knee angle
        if (displayedAngles < 2 && 
            isValidKeypoint(keypoints[LEFT_HIP]) && 
            isValidKeypoint(keypoints[LEFT_KNEE]) && 
            isValidKeypoint(keypoints[LEFT_ANKLE])) {
          
          const kneeAngle = calculateAngle(
            keypoints[LEFT_HIP], 
            keypoints[LEFT_KNEE], 
            keypoints[LEFT_ANKLE]
          );
          
          drawAngle(
            ctx, 
            keypoints[LEFT_HIP], 
            keypoints[LEFT_KNEE], 
            keypoints[LEFT_ANKLE], 
            `${Math.round(kneeAngle)}°`,
            visualStyle.tertiaryAngleColor
          );
        }
        break;
        
      case 'serve':
        // Right shoulder-elbow angle
        if ((keypoints[RIGHT_HIP] && keypoints[RIGHT_HIP].score > 0.1) && 
            (keypoints[RIGHT_SHOULDER] && keypoints[RIGHT_SHOULDER].score > 0.1) && 
            (keypoints[RIGHT_ELBOW] && keypoints[RIGHT_ELBOW].score > 0.1)) {
          
          const shoulderToElbowAngle = calculateAngle(
            keypoints[RIGHT_HIP],
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            shoulderToElbowAngle !== null ? `${shoulderToElbowAngle}°` : 'Calculating...',
            'rgba(255, 220, 50, 0.9)',
            40,
            4
          );
          displayedAngles++;
        }
        
        // Elbow-wrist angle
        if ((keypoints[RIGHT_SHOULDER] && keypoints[RIGHT_SHOULDER].score > 0.1) && 
            (keypoints[RIGHT_ELBOW] && keypoints[RIGHT_ELBOW].score > 0.1) && 
            (keypoints[RIGHT_WRIST] && keypoints[RIGHT_WRIST].score > 0.1)) {
          
          const elbowToWristAngle = calculateAngle(
            keypoints[RIGHT_SHOULDER],
            keypoints[RIGHT_ELBOW],
            keypoints[RIGHT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST], 
            elbowToWristAngle !== null ? `${elbowToWristAngle}°` : 'Calculating...',
            'rgba(50, 220, 255, 0.9)',
            35,
            3
          );
          displayedAngles++;
        }
        
        // Knee angle
        if (displayedAngles < 2 && 
            (keypoints[RIGHT_HIP] && keypoints[RIGHT_HIP].score > 0.1) && 
            (keypoints[RIGHT_KNEE] && keypoints[RIGHT_KNEE].score > 0.1) && 
            (keypoints[RIGHT_ANKLE] && keypoints[RIGHT_ANKLE].score > 0.1)) {
          
          const kneeAngle = calculateAngle(
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE], 
            `${Math.round(kneeAngle)}°`,
            visualStyle.tertiaryAngleColor,
            30,
            3
          );
          displayedAngles++;
        }
        break;
        
      case 'volley':
        // Knee angle
        if ((keypoints[RIGHT_HIP] && keypoints[RIGHT_HIP].score > 0.1) && 
            (keypoints[RIGHT_KNEE] && keypoints[RIGHT_KNEE].score > 0.1) && 
            (keypoints[RIGHT_ANKLE] && keypoints[RIGHT_ANKLE].score > 0.1)) {
          
          const kneeAngle = calculateAngle(
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE], 
            `${Math.round(kneeAngle)}°`,
            'rgba(255, 220, 50, 0.9)',
            35,
            4
          );
          displayedAngles++;
        }
        
        // Right shoulder-elbow-wrist angle
        if ((keypoints[RIGHT_SHOULDER] && keypoints[RIGHT_SHOULDER].score > 0.1) && 
            (keypoints[RIGHT_ELBOW] && keypoints[RIGHT_ELBOW].score > 0.1) && 
            (keypoints[RIGHT_WRIST] && keypoints[RIGHT_WRIST].score > 0.1)) {
          
          const elbowAngle = calculateAngle(
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST], 
            elbowAngle !== null ? `${elbowAngle}°` : 'Calculating...',
            'rgba(50, 220, 255, 0.9)',
            35,
            3
          );
          displayedAngles++;
        }
        break;
    }
  } else {
    // Front view angles
    switch (strokeType) {
      case 'forehand':
        if (isValidKeypoint(keypoints[RIGHT_SHOULDER]) && 
            isValidKeypoint(keypoints[RIGHT_ELBOW]) && 
            isValidKeypoint(keypoints[RIGHT_WRIST])) {
          
          const elbowAngle = calculateAngle(
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST], 
            `${Math.round(elbowAngle)}°`,
            visualStyle.primaryAngleColor
          );
          displayedAngles++;
        }
        break;
        
      case 'backhand':
        if (isValidKeypoint(keypoints[LEFT_SHOULDER]) && 
            isValidKeypoint(keypoints[LEFT_ELBOW]) && 
            isValidKeypoint(keypoints[LEFT_WRIST])) {
          
          const elbowAngle = calculateAngle(
            keypoints[LEFT_SHOULDER], 
            keypoints[LEFT_ELBOW], 
            keypoints[LEFT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[LEFT_SHOULDER], 
            keypoints[LEFT_ELBOW], 
            keypoints[LEFT_WRIST], 
            `${Math.round(elbowAngle)}°`,
            visualStyle.primaryAngleColor
          );
          displayedAngles++;
        }
        break;
        
      case 'serve':
        if (isValidKeypoint(keypoints[RIGHT_SHOULDER]) && 
            isValidKeypoint(keypoints[RIGHT_ELBOW]) && 
            isValidKeypoint(keypoints[RIGHT_WRIST])) {
          
          const armExtension = calculateAngle(
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_SHOULDER], 
            keypoints[RIGHT_ELBOW], 
            keypoints[RIGHT_WRIST], 
            `${Math.round(armExtension)}°`,
            visualStyle.primaryAngleColor
          );
          displayedAngles++;
        }
        break;
        
      case 'volley':
        if (isValidKeypoint(keypoints[RIGHT_HIP]) && 
            isValidKeypoint(keypoints[RIGHT_KNEE]) && 
            isValidKeypoint(keypoints[RIGHT_ANKLE])) {
          
          const kneeAngle = calculateAngle(
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE]
          );
          
          drawAngle(
            ctx, 
            keypoints[RIGHT_HIP], 
            keypoints[RIGHT_KNEE], 
            keypoints[RIGHT_ANKLE], 
            `${Math.round(kneeAngle)}°`,
            visualStyle.primaryAngleColor
          );
          displayedAngles++;
        }
        break;
    }
  }
}

/**
 * Draw angle
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} pointA - First point
 * @param {Object} pointB - Center point (angle vertex)
 * @param {Object} pointC - Last point
 * @param {string} text - Text to display
 * @param {string} color - Angle color
 * @param {number} radius - Arc radius
 * @param {number} lineWidth - Line width
 */
function drawAngle(ctx, pointA, pointB, pointC, text, color = 'rgba(255, 255, 0, 0.7)', radius = 30, lineWidth = 3) {
  // Check if any point is invalid
  if (!pointA || !pointB || !pointC) return;
  
  // Check for NaN in text
  const displayText = text.includes('NaN') || text.includes('null') ? 'Calculating...' : text;
  
  try {
    // Validate point coordinates
    if (typeof pointA.x !== 'number' || typeof pointA.y !== 'number' ||
        typeof pointB.x !== 'number' || typeof pointB.y !== 'number' ||
        typeof pointC.x !== 'number' || typeof pointC.y !== 'number') {
      // Draw error angle
      drawErrorAngle(ctx, pointB, displayText, color);
      return;
    }
    
    // Check for NaN or Infinity values
    if (isNaN(pointA.x) || isNaN(pointA.y) || 
        isNaN(pointB.x) || isNaN(pointB.y) || 
        isNaN(pointC.x) || isNaN(pointC.y) ||
        !isFinite(pointA.x) || !isFinite(pointA.y) ||
        !isFinite(pointB.x) || !isFinite(pointB.y) ||
        !isFinite(pointC.x) || !isFinite(pointC.y)) {
      // Draw error angle
      drawErrorAngle(ctx, pointB, displayText, color);
      return;
    }
    
    // Calculate angle between two vectors
    const angle1 = Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    const angle2 = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x);
    
    if (isNaN(angle1) || isNaN(angle2)) {
      drawErrorAngle(ctx, pointB, displayText, color);
      return;
    }
    
    const angle = angle2 - angle1;
    
    // Normalize angle to 0-2π range
    const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
    
    if (isNaN(normalizedAngle)) {
      drawErrorAngle(ctx, pointB, displayText, color);
      return;
    }
    
    // Draw arc
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.arc(pointB.x, pointB.y, radius, angle1, angle2, normalizedAngle > Math.PI);
    ctx.stroke();
    
    // Calculate text position (arc midpoint)
    const textAngle = angle1 + normalizedAngle / 2;
    const textX = pointB.x + (radius + 15) * Math.cos(textAngle);
    const textY = pointB.y + (radius + 15) * Math.sin(textAngle);
    
    // Draw text background (larger background)
    const textWidth = ctx.measureText(displayText).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(textX - textWidth / 2 - 6, textY - 16, textWidth + 12, 24);
    
    // Draw text (larger font)
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, textX, textY);
  } catch (error) {
    console.error('Angle drawing error:', error);
    // Draw error angle
    drawErrorAngle(ctx, pointB, displayText, color);
  }
}

/**
 * Draw error angle
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} point - Center point
 * @param {string} text - Text to display
 * @param {string} color - Angle color
 */
function drawErrorAngle(ctx, point, text, color) {
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return;
  
  try {
    // Draw dashed circle
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw text
    const textX = point.x;
    const textY = point.y - 25;
    
    // Draw text background
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(textX - textWidth / 2 - 6, textY - 16, textWidth + 12, 24);
    
    // Draw text
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, textX, textY);
  } catch (error) {
    console.error('Error angle drawing error:', error);
  }
}

/**
 * Draw motion trajectory
 * @param {Array} keypoints - Array of keypoints
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} strokeType - Stroke type
 */
function drawMotionTrajectory(keypoints, ctx, strokeType) {
  // Check if motion history is available
  if (!motionHistory || !motionHistory.keypoints || motionHistory.keypoints.length < 2) return;
  
  // Define target keypoints based on stroke type
  const targetKeypoints = [];
  switch (strokeType) {
    case 'forehand':
      targetKeypoints.push(RIGHT_WRIST, RIGHT_ELBOW);
      break;
    case 'backhand':
      targetKeypoints.push(LEFT_WRIST, LEFT_ELBOW, RIGHT_WRIST);
      break;
    case 'serve':
      targetKeypoints.push(RIGHT_WRIST, RIGHT_ELBOW, RIGHT_SHOULDER);
      break;
    case 'volley':
      targetKeypoints.push(RIGHT_WRIST, LEFT_WRIST);
      break;
    default:
      targetKeypoints.push(RIGHT_WRIST, LEFT_WRIST);
  }
  
  // Draw trajectory for each target keypoint
  for (const keypointIdx of targetKeypoints) {
    const history = motionHistory.keypoints.slice(-10); // Use last 10 frames
    const positions = [];
    
    // Filter valid keypoint positions
    for (const frame of history) {
      const kp = frame[keypointIdx];
      if (kp && kp.score > 0.3) {
        positions.push(kp);
      }
    }
    
    if (positions.length < 2) continue;
    
    // Draw trajectory
    ctx.beginPath();
    ctx.moveTo(positions[0].x, positions[0].y);
    
    for (let i = 1; i < positions.length; i++) {
      ctx.lineTo(positions[i].x, positions[i].y);
    }
    
    // Choose color based on keypoint
    let strokeColor = 'rgba(255, 255, 255, 0.5)';
    if (keypointIdx === RIGHT_WRIST || keypointIdx === LEFT_WRIST) {
      strokeColor = strokeType === 'forehand' ? 
                   'rgba(255, 165, 0, 0.7)' : // Forehand: Orange
                   'rgba(0, 191, 255, 0.7)';  // Others: Sky blue
    } else if (keypointIdx === RIGHT_ELBOW || keypointIdx === LEFT_ELBOW) {
      strokeColor = 'rgba(0, 255, 0, 0.6)';  // Elbow: Green
    }
    
    // Create gradient for time direction
    const gradient = ctx.createLinearGradient(
      positions[0].x, positions[0].y,
      positions[positions.length-1].x, positions[positions.length-1].y
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, strokeColor);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Draw current position
    const current = positions[positions.length - 1];
    ctx.beginPath();
    ctx.arc(current.x, current.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = strokeColor.replace('0.7', '0.9');
    ctx.fill();
  }
}

/**
 * Get visualization style based on camera position
 * @param {string} cameraPosition - Camera position
 * @returns {Object} - Visualization style
 */
function getVisualizationStyleForCamera(cameraPosition) {
  // Default style
  const defaultStyle = {
    thinLineWidth: 2,
    boldLineWidth: 4,
    smallKeypointRadius: 4,
    largeKeypointRadius: 7, // Increase keypoint size
    secondaryLineColor: 'rgba(100, 100, 255, 0.6)',
    primaryLineColor: 'rgba(255, 100, 100, 0.9)',
    secondaryKeypointColor: 'rgba(100, 255, 100, 0.6)',
    primaryKeypointColor: 'rgba(255, 255, 0, 0.9)',
    primaryAngleColor: 'rgba(255, 220, 50, 0.9)', // Brighter color
    secondaryAngleColor: 'rgba(50, 220, 255, 0.9)', // Brighter color
    tertiaryAngleColor: 'rgba(220, 50, 255, 0.9)', // Brighter color
    textColor: 'white',
    textFont: 'bold 16px Arial' // Bold font
  };
  
  // Adjust style based on camera position
  switch (cameraPosition) {
    case 'side':
      return {
        ...defaultStyle,
        boldLineWidth: 5,
        largeKeypointRadius: 7
      };
    case 'front':
      return {
        ...defaultStyle,
        primaryLineColor: 'rgba(255, 150, 50, 0.9)'
      };
    case 'rear-elevated':
    default:
      return defaultStyle;
  }
}

/**
 * Check if keypoint is valid
 * @param {Object} keypoint - Keypoint object
 * @returns {boolean} - Validity
 */
function isValidKeypoint(keypoint) {
  return keypoint && keypoint.score > 0.15; // Lower threshold
}